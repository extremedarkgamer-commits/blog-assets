(function(){
  var galleries=document.querySelectorAll('.gallery[data-imgs]');
  if(!galleries.length)return;

  // cria o lightbox uma única vez
  if(!document.getElementById('lightbox')){
    var lb=document.createElement('div');
    lb.id='lightbox';
    lb.style='display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);justify-content:center;align-items:center;z-index:9999;';
    lb.innerHTML='<span id="prev" style="position:absolute;left:20px;top:50%;font-size:3em;color:white;cursor:pointer;">&#10094;</span><img id="lightbox-img" style="max-width:95%;max-height:90%;border-radius:6px;"/><span id="next" style="position:absolute;right:20px;top:50%;font-size:3em;color:white;cursor:pointer;">&#10095;</span>';
    document.body.appendChild(lb);

    lb.addEventListener('click',function(e){
      if(e.target.id==='lightbox'||e.target.tagName==='IMG'){lb.style.display='none';}
    });
    document.getElementById('prev').addEventListener('click',function(e){e.stopPropagation();change(-1);});
    document.getElementById('next').addEventListener('click',function(e){e.stopPropagation();change(1);});
  }

  var current=0,imgsAll=[];
  function show(i){document.getElementById('lightbox-img').src=imgsAll[i];}
  function change(step){current=(current+step+imgsAll.length)%imgsAll.length;show(current);}
  window.openLightbox=function(i){current=i;show(i);document.getElementById('lightbox').style.display='flex';};

  galleries.forEach(function(div){
    var imgs=div.getAttribute('data-imgs').split(/[\s,]+/).filter(Boolean);
    if(!imgs.length)return;
    imgsAll=imgs;
    var main=imgs[0];
    var thumbs='';
    for(var i=1;i<imgs.length;i++){
      thumbs+='<img src="'+imgs[i]+'" style="width:30%;max-width:150px;margin:3px;cursor:pointer;border-radius:4px;" onclick="openLightbox('+i+')"/>';
    }
    div.innerHTML='<div class="gallery-main"><img src="'+main+'" style="max-width:100%;border-radius:6px;cursor:pointer;" onclick="openLightbox(0)"/></div><div class="gallery-thumbs">'+thumbs+'</div>';
  });
})();
