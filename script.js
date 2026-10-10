(function(){
  /* --- accordions --- */
  document.querySelectorAll('.acc-head').forEach(function(head){
    head.addEventListener('click', function(){
      var acc  = head.closest('.acc');
      var body = acc.querySelector('.acc-body');
      var open = acc.classList.contains('open');
      if(open){
        body.style.maxHeight = '0px';
        acc.classList.remove('open');
        head.setAttribute('aria-expanded','false');
      }else{
        acc.classList.add('open');
        head.setAttribute('aria-expanded','true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
  function fitOpen(){
    document.querySelectorAll('.acc.open .acc-body').forEach(function(b){
      b.style.maxHeight = b.scrollHeight + 'px';
    });
  }
  fitOpen();
  window.addEventListener('resize', fitOpen);
  window.addEventListener('load', fitOpen);

  /* --- experience tabs --- */
  var expTabs = document.querySelectorAll('.exp-tab');
  var expPanels = document.querySelectorAll('.exp-panel');
  function activateExpTab(tab, moveFocus){
    var target = tab.dataset.exp;
    expTabs.forEach(function(t){
      var active = t === tab;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      t.setAttribute('tabindex', active ? '0' : '-1');
    });
    expPanels.forEach(function(panel){
      var active = panel.dataset.expPanel === target;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
    if(moveFocus) tab.focus();
  }
  expTabs.forEach(function(tab){
    tab.addEventListener('click', function(){ activateExpTab(tab, false); });
    tab.addEventListener('keydown', function(e){
      var keys = ['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'];
      if(keys.indexOf(e.key) === -1) return;
      e.preventDefault();
      var tabs = [].slice.call(expTabs);
      var index = tabs.indexOf(tab);
      if(e.key === 'Home') index = 0;
      else if(e.key === 'End') index = tabs.length - 1;
      else if(e.key === 'ArrowRight' || e.key === 'ArrowDown') index = (index + 1) % tabs.length;
      else index = (index - 1 + tabs.length) % tabs.length;
      activateExpTab(tabs[index], true);
    });
  });

  /* --- work filters --- */
  var btns = document.querySelectorAll('.chipbtn');
  btns.forEach(function(b){
    b.addEventListener('click', function(){
      btns.forEach(function(x){ x.classList.remove('on'); x.setAttribute('aria-pressed','false'); });
      b.classList.add('on');
      b.setAttribute('aria-pressed','true');
      var f = b.dataset.f;
      document.querySelectorAll('#work .acc').forEach(function(card){
        card.hidden = !(f === 'all' || card.dataset.type === f);
      });
    });
  });

  /* --- nav state --- */
  var nav = document.getElementById('nav');
  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  var secs = [].slice.call(document.querySelectorAll('main > section[id]'));
  function onScroll(){
    nav.classList.toggle('scrolled', window.scrollY > 12);
    var pos = window.scrollY + 120, cur = '';
    secs.forEach(function(s){ if(s.offsetTop <= pos) cur = s.id; });
    links.forEach(function(l){
      l.classList.toggle('active', l.getAttribute('href') === '#' + cur && !l.classList.contains('nav-cta'));
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* --- mobile menu --- */
  var burger = document.getElementById('burger');
  var navlinks = document.getElementById('navlinks');
  function setMenu(open){
    navlinks.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
  }
  burger.addEventListener('click', function(){ setMenu(!navlinks.classList.contains('open')); });
  navlinks.addEventListener('click', function(e){ if(e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && navlinks.classList.contains('open')){ setMenu(false); burger.focus(); }
  });

  /* --- reveal on scroll --- */
  var rv = document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en, i){
        if(en.isIntersecting){
          setTimeout(function(){ en.target.classList.add('in'); }, Math.min(i*55, 220));
          io.unobserve(en.target);
        }
      });
    }, {threshold:0.08, rootMargin:'0px 0px -40px 0px'});
    rv.forEach(function(el){ io.observe(el); });
  }else{
    rv.forEach(function(el){ el.classList.add('in'); });
  }
})();
