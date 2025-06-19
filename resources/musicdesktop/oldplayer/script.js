document.addEventListener('DOMContentLoaded', function() {
  const player = document.querySelector('.player');
  const header = document.querySelector('.window-head');
  
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  header.onmousedown = dragMouseDown;
  
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    let newTop = player.offsetTop - pos2;
    let newLeft = player.offsetLeft - pos1;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const playerWidth = player.offsetWidth;
    const playerHeight = player.offsetHeight;
    


    newTop = Math.max(0, newTop);

    newLeft = Math.max(0, newLeft);

    newTop = Math.min(viewportHeight - playerHeight, newTop);

    newLeft = Math.min(viewportWidth - playerWidth, newLeft);
    

    player.style.top = newTop + "px";
    player.style.left = newLeft + "px";
  }
  
  function closeDragElement() {

    document.onmouseup = null;
    document.onmousemove = null;
  }
  

  window.addEventListener('resize', function() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const playerWidth = player.offsetWidth;
    const playerHeight = player.offsetHeight;
    
    let currentTop = parseInt(player.style.top) || 100;
    let currentLeft = parseInt(player.style.left) || 100;

    currentTop = Math.max(0, Math.min(viewportHeight - playerHeight, currentTop));
    currentLeft = Math.max(0, Math.min(viewportWidth - playerWidth, currentLeft));
    
    player.style.top = currentTop + "px";
    player.style.left = currentLeft + "px";
  });
});