/* Attendance Calculator
   Reads the user's values, validates them, and updates the result card
   and every milestone row on the page. */
(function(){
  // Cache the DOM elements once to avoid repeated document lookups.
  var $=function(id){return document.getElementById(id)};
  var att=$('att'),tot=$('tot'),msg=$('msg'),res=$('result'),list=$('list'),fg=$('fg');

  // Store the milestone targets and progress-ring circumference.
  var MILES=[75,80,85,90,95],CIRC=2*Math.PI*48,queued=false,quiet=true;
  var ATTENDED_KEY='attendance-calculator-attended';
  var TOTAL_KEY='attendance-calculator-total';
  var THEME_KEY='attendance-calculator-theme';

  // Respect the user's operating-system preference for reduced motion.
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Safely read and write local storage so private browsing cannot break the app.
  function readStoredValue(key){
    try{return localStorage.getItem(key)||'';}
    catch(e){return '';}
  }

  function writeStoredValue(key,value){
    try{
      if(value==='')localStorage.removeItem(key);
      else localStorage.setItem(key,value);
    }catch(e){}
  }

  // Initialize the progress ring so it starts empty.
  fg.style.strokeDasharray=CIRC;
  fg.style.strokeDashoffset=CIRC;

  // Update a text label with a small entrance animation when motion is allowed.
  function swap(el,txt){
    if(el.textContent===txt)return;
    el.textContent=txt;
    if(!quiet&&!reduce&&el.animate)el.animate(
      [{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],
      {duration:180,easing:'cubic-bezier(.2,.8,.2,1)',iterations:1}
    );
  }

  // Count a number from its current value to the new target value.
  function tween(el,to,dec){
    if(el._raf)cancelAnimationFrame(el._raf);
    if(to===null){el._v=0;el.textContent='\u2013';return}
    var from=el._v||0,t0=performance.now(),d=reduce?0:Math.min(300,160+Math.abs(to-from)*3);
    function f(n){
      var k=d?Math.min(1,(n-t0)/d):1,e=1-Math.pow(1-k,3),v=from+(to-from)*e;
      el._v=v;
      el.textContent=dec?v.toFixed(1).replace(/\.0$/,''):Math.round(v);
      if(k<1)el._raf=requestAnimationFrame(f);
    }
    el._raf=requestAnimationFrame(f);
  }

  // Return the correct singular or plural word for a class count.
  function word(n){return n===1?'class':'classes'}

  // Create all five fixed milestone rows once and cache their elements.
  var rows=MILES.map(function(m){
    var r=document.createElement('div');
    r.className='row';
    r.innerHTML='<div class="tag">'+m+'%</div><div class="t"><strong></strong><span></span></div><div class="n"><b>\u2013</b><small></small></div>';
    list.appendChild(r);
    return{r:r,top:r.querySelector('strong'),sub:r.querySelector('span'),num:r.querySelector('b'),unit:r.querySelector('small'),m:m};
  });

  // Reset the result display while one or both inputs are empty.
  function empty(){
    res.style.setProperty('--c','var(--muted)');
    fg.style.strokeDashoffset=CIRC;
    tween($('pct'),0,1);
    $('bn').hidden=true;
    swap($('bl'),'Enter your sessions');
    swap($('bu'),'');
    swap($('note'),'Your milestones update live as you type.');
    rows.forEach(function(o){
      o.r.className='row';
      swap(o.top,'Your '+o.m+'% target');
      swap(o.sub,'Waiting for your sessions');
      tween(o.num,null);
      swap(o.unit,'');
    });
  }

  // Render the percentage, safe skip count, required attendance, and milestones.
  function render(a,t){
    var p=a/t*100,ok=p>=75;
    var color=ok?'var(--good)':(p>=65?'var(--warn)':'var(--bad)');
    res.style.setProperty('--c',color);
    fg.style.strokeDashoffset=CIRC*(1-p/100);
    tween($('pct'),p,1);
    var bn=$('bn');
    bn.hidden=false;

    if(ok){
      // Calculate how many future classes can be skipped while staying at 75%.
      var s=Math.max(0,Math.floor(a*100/75-t+1e-9));
      swap($('bl'),'You\u2019re safe. You can skip');
      tween(bn,s);
      swap($('bu'),word(s)+' and stay at 75%.');
      swap($('note'),s===0?'You\u2019re right on the line. Attend the next class to build a cushion.':'You\u2019re above the usual 75% cutoff.');
    }else{
      // Calculate the minimum consecutive classes needed to reach 75%.
      var need=Math.ceil((75*t-100*a)/25-1e-9);
      swap($('bl'),'Attend the next');
      tween(bn,need);
      swap($('bu'),word(need)+' to reach 75%.');
      swap($('note'),'Skipping any of them pushes the target further away.');
    }

    // Update each milestone as either a safe-skip or required-attendance target.
    rows.forEach(function(o){
      var m=o.m,n;
      if(p>=m){
        n=Math.max(0,Math.floor(a*100/m-t+1e-9));
        o.r.className='row skip';
        swap(o.top,'Can skip');
        swap(o.sub,'and still stay at '+m+'%');
      }else{
        n=Math.ceil((m*t-100*a)/(100-m)-1e-9);
        o.r.className='row need';
        swap(o.top,'Need to attend');
        swap(o.sub,'in a row to reach '+m+'%');
      }
      tween(o.num,n);
      swap(o.unit,word(n));
    });
  }

  // Strip any non-digit characters from an input field.
  function clean(el){el.value=el.value.replace(/\D/g,'')}

  // Validate and calculate the current attendance values.
  function calc(){
    clean(att);
    clean(tot);
    writeStoredValue(ATTENDED_KEY,att.value);
    writeStoredValue(TOTAL_KEY,tot.value);
    att.classList.remove('err');
    tot.classList.remove('err');
    msg.textContent='';
    if(att.value===''||tot.value===''){empty();return}
    var a=parseInt(att.value,10),t=parseInt(tot.value,10);
    if(t<1){
      tot.classList.add('err');
      msg.textContent='Total sessions must be at least 1.';
      empty();
      return;
    }
    if(a>t){
      att.classList.add('err');
      msg.textContent='Attended can\u2019t be more than total sessions.';
      empty();
      return;
    }
    render(a,t);
  }

  // Collapse rapid input events into one calculation per animation frame.
  function queue(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(function(){queued=false;calc()});
  }

  // Attach live input, Enter-key, and reset behavior.
  att.addEventListener('input',queue);
  tot.addEventListener('input',queue);
  att.addEventListener('keydown',function(e){if(e.key==='Enter')tot.focus()});
  $('reset').addEventListener('click',function(){
    att.value='';
    tot.value='';
    writeStoredValue(ATTENDED_KEY,'');
    writeStoredValue(TOTAL_KEY,'');
    calc();
    att.focus();
  });

  // Toggle only between the explicit light and dark theme values.
  var root=document.documentElement;
  var themeButton=$('theme');
  var themeIcon=$('themeIcon');

  // Restore the saved theme before the initial render to avoid an unwanted flash.
  var savedTheme=readStoredValue(THEME_KEY);
  if(savedTheme==='dark'||savedTheme==='light'){
    root.setAttribute('data-theme',savedTheme);
  }

  // Restart the icon animation each time the theme is changed.
  function animateThemeIcon(){
    themeIcon.classList.remove('is-spinning');
    void themeIcon.offsetWidth;
    themeIcon.classList.add('is-spinning');
  }

  // Clear the temporary animation class after it completes.
  themeIcon.addEventListener('animationend',function(){
    themeIcon.classList.remove('is-spinning');
  });

  // Toggle the document theme and play a short icon rotation.
  themeButton.addEventListener('click',function(){
    var dark=root.getAttribute('data-theme')?root.getAttribute('data-theme')==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
    var nextTheme=dark?'light':'dark';
    root.setAttribute('data-theme',nextTheme);
    writeStoredValue(THEME_KEY,nextTheme);
    animateThemeIcon();
  });

  // Restore saved attendance values before the first live calculation.
  att.value=readStoredValue(ATTENDED_KEY);
  tot.value=readStoredValue(TOTAL_KEY);

  // Initialize the saved or empty state after creating the milestone rows.
  calc();
  quiet=false;

  // Creator modal behavior: open from the title and support several close methods.
  var appTitle=$('appTitle');
  var creatorModal=$('creatorModal');
  var modalClose=$('modalClose');
  var previouslyFocused=null;

  // Display the modal and move keyboard focus to its close button.
  function openCreatorModal(){
    previouslyFocused=document.activeElement;
    creatorModal.classList.add('is-open');
    creatorModal.setAttribute('aria-hidden','false');
    modalClose.focus();
  }

  // Hide the modal and restore focus to the element that opened it.
  function closeCreatorModal(){
    creatorModal.classList.remove('is-open');
    creatorModal.setAttribute('aria-hidden','true');
    if(previouslyFocused)previouslyFocused.focus();
  }

  // Mouse or touch opening from the title.
  appTitle.addEventListener('click',openCreatorModal);

  // Keyboard opening also supports Enter and Space for accessibility.
  appTitle.addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' '){
      e.preventDefault();
      openCreatorModal();
    }
  });

  // Close through the dedicated button or by pressing Escape.
  modalClose.addEventListener('click',closeCreatorModal);
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&creatorModal.classList.contains('is-open')){
      closeCreatorModal();
    }
  });

  // Clicking outside the card dismisses the modal.
  creatorModal.addEventListener('click',function(e){
    if(e.target===creatorModal)closeCreatorModal();
  });
})();
