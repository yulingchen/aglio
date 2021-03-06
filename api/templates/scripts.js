/* eslint-env browser */
/* eslint quotes: [2, "single"] */
'use strict';

/*
  Determine if a string ends with another string.
*/
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/*
  Get a list of direct child elements by class name.
*/
function childrenByClass(element, name) {
  var filtered = [];

  for (var i = 0; i < element.children.length; i++) {
    var child = element.children[i];
    var classNames = child.className.split(' ');
    if (classNames.indexOf(name) !== -1) {
      filtered.push(child);
    }
  }

  return filtered;
}

/*
  Get an array [width, height] of the window.
*/
function getWindowDimensions() {
  var w = window,
      d = document,
      e = d.documentElement,
      g = d.body,
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;

  return [x, y];
}

/*
  Collapse or show a request/response example.
*/
function toggleCollapseButton(event) {
    var button = event.target.parentNode;
    var content = button.parentNode.nextSibling;
    var inner = content.children[0];

    if (button.className.indexOf('collapse-button') === -1) {
      // Clicked without hitting the right element?
      return;
    }

    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        // Currently showing, so let's hide it
        button.className = 'collapse-button';
        content.style.maxHeight = '0px';
    } else {
        // Currently hidden, so let's show it
        button.className = 'collapse-button show';
        content.style.maxHeight = inner.offsetHeight + 12 + 'px';
    }
}

function toggleTabButton(event) {
    var i, index;
    var button = event.target;

    // Get index of the current button.
    var buttons = childrenByClass(button.parentNode, 'tab-button');
    for (i = 0; i < buttons.length; i++) {
        if (buttons[i] === button) {
            index = i;
            button.className = 'tab-button active';
        } else {
            buttons[i].className = 'tab-button';
        }
    }

    // Hide other tabs and show this one.
    var tabs = childrenByClass(button.parentNode.parentNode, 'tab');
    for (i = 0; i < tabs.length; i++) {
        if (i === index) {
            tabs[i].style.display = 'block';
        } else {
            tabs[i].style.display = 'none';
        }
    }
}

/*
  Collapse or show a navigation menu. It will not be hidden unless it
  is currently selected or `force` has been passed.
*/
function toggleCollapseNav(event, force) {
    var heading = event.target.parentNode;
    var content = heading.nextSibling;
    var inner = content.children[0];

    if (heading.className.indexOf('heading') === -1) {
      // Clicked without hitting the right element?
      return;
    }

    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
      // Currently showing, so let's hide it, but only if this nav item
      // is already selected. This prevents newly selected items from
      // collapsing in an annoying fashion.
      if (force || window.location.hash && endsWith(event.target.href, window.location.hash)) {
        content.style.maxHeight = '0px';
      }
    } else {
      // Currently hidden, so let's show it
      content.style.maxHeight = inner.offsetHeight + 12 + 'px';
    }
}

/*
  Refresh the page after a live update from the server. This only
  works in live preview mode (using the `--server` parameter).
*/
function refresh(body) {
    document.querySelector('body').className = 'preload';
    document.body.innerHTML = body;

    // Re-initialize the page
    init();
    autoCollapse();

    document.querySelector('body').className = '';
}

/*
  Determine which navigation items should be auto-collapsed to show as many
  as possible on the screen, based on the current window height. This also
  collapses them.
*/
function autoCollapse() {
  var windowHeight = getWindowDimensions()[1];
  var itemsHeight = 64; /* Account for some padding */
  var itemsArray = Array.prototype.slice.call(
    document.querySelectorAll('nav .resource-group .heading'));

  // Get the total height of the navigation items
  itemsArray.forEach(function (item) {
    itemsHeight += item.parentNode.offsetHeight;
  });

  // Should we auto-collapse any nav items? Try to find the smallest item
  // that can be collapsed to show all items on the screen. If not possible,
  // then collapse the largest item and do it again. First, sort the items
  // by height from smallest to largest.
  var sortedItems = itemsArray.sort(function (a, b) {
    return a.parentNode.offsetHeight - b.parentNode.offsetHeight;
  });

  while (sortedItems.length && itemsHeight > windowHeight) {
    for (var i = 0; i < sortedItems.length; i++) {
      // Will collapsing this item help?
      var itemHeight = sortedItems[i].nextSibling.offsetHeight;
      if ((itemsHeight - itemHeight <= windowHeight) || i === sortedItems.length - 1) {
        // It will, so let's collapse it, remove its content height from
        // our total and then remove it from our list of candidates
        // that can be collapsed.
        itemsHeight -= itemHeight;
        toggleCollapseNav({target: sortedItems[i].children[0]}, true);
        sortedItems.splice(i, 1);
        break;
      }
    }
  }
}



var result = [];
var paramId = 0;
 // 对导入的json进行处理
function objParse(test,i,parentid){

   var objAnalysis =  test;
   // 对象的解析
    for (var obj in objAnalysis) {
          if (objAnalysis.hasOwnProperty(obj)) {

             
             var paramType ;

             // console.log('obj',obj,objAnalysis[obj].type)

            
             if (objAnalysis[obj].type === "object"){
              paramType = "object"
             }
             
             else if(objAnalysis[obj].type === "array" && objAnalysis[obj].items.type==="string"){
               paramType = "array<string>"
             }
             else if(objAnalysis[obj].type === "array" && objAnalysis[obj].items.type==="number"){
               paramType = "array<number>"
             }
             else if(objAnalysis[obj].type === "array" && objAnalysis[obj].items.type==="boolean"){
               paramType = "array<boolean>"
             }
              else if(objAnalysis[obj].type === "array" && objAnalysis[obj].items.type==="object"){
               paramType = "array<object>"
             }
             else {
              paramType = objAnalysis[obj].type
             }
              paramId += 1;
              // 如果为对象或者为array<object>要接着递归解析
              if (
                  (objAnalysis[obj].type === "object" && objAnalysis[obj].properties)
                  || 
                  (objAnalysis[obj].type === "array" && objAnalysis[obj].items.type==="object" && objAnalysis[obj].items.properties)
              ) {
                 
                  var defaultParamsResponses = {
                        name:obj,          // 数据的变量名称
                        type: paramType,       // 数据的类型
                        required: objAnalysis[obj].required ? objAnalysis[obj].required :false,    // 是否必填
                        description: objAnalysis[obj].description ? objAnalysis[obj].description :null, // 数据的描述
                        default: objAnalysis[obj].default ? objAnalysis[obj].default :null,     // 默认值
                        extend: true,  // 是否可以扩展(是否可以有子属性)
                        isfold: true,          // 是否已经展开，前提条件可以扩展，默认true
                        level: i,        // 属于哪个层级，不同的层级间距，颜色不一致
                        index:  paramId,     // 每一行都有自己的下标
                        indexArr: parentid?parentid:null,  // 每一行所属的父级的下标
                        isShow: true ,  // 自身这一行是否显示

                  }
                
                  result.push(defaultParamsResponses);
                  if (objAnalysis[obj].properties) {
                         objParse(objAnalysis[obj].properties,i+1,paramId);
                  }else{
                      objParse(objAnalysis[obj].items.properties,i+1,paramId);
                  }
             

              }else{

                      var defaultParamsResponsesnoson = {
                            name:obj,          // 数据的变量名称
                            type: paramType,       // 数据的类型
                            required: objAnalysis[obj].required ? objAnalysis[obj].required :false,    // 是否必填
                            description: objAnalysis[obj].description ? objAnalysis[obj].description :null, // 数据的描述
                            default: objAnalysis[obj].default ? objAnalysis[obj].default :null,     // 默认值
                            extend: false,     // 是否可以扩展(是否可以有子属性)
                            isfold: true,          // 是否已经展开，前提条件可以扩展，默认true
                            level: i,        // 属于哪个层级，不同的层级间距，颜色不一致
                            index:  paramId,     // 每一行都有自己的下标
                            indexArr: parentid?parentid:null,  // 每一行所属的父级的下标
                            isShow: true ,  // 自身这一行是否显示
                      }
                      if (objAnalysis[obj].type === "object" || (objAnalysis[obj].type === "array" && objAnalysis[obj].items.type==="object")) {
                        defaultParamsResponsesnoson.extend = true;
                      }
                      if (objAnalysis[obj].type) {
                        result.push(defaultParamsResponsesnoson)
                      }
              }
          }
     }
};


/*
  Initialize the interactive functionality of the page.
*/
function init() {
    var i, j;

    // Make collapse buttons clickable
    var buttons = document.querySelectorAll('.collapse-button');
    for (i = 0; i < buttons.length; i++) {
        buttons[i].onclick = toggleCollapseButton;

        // Show by default? Then toggle now.
        if (buttons[i].className.indexOf('show') !== -1) {
            toggleCollapseButton({target: buttons[i].children[0]});
        }
    }

    var responseCodes = document.querySelectorAll('.example-names');
    for (i = 0; i < responseCodes.length; i++) {
        var tabButtons = childrenByClass(responseCodes[i], 'tab-button');
        for (j = 0; j < tabButtons.length; j++) {
            tabButtons[j].onclick = toggleTabButton;

            // Show by default?
            if (j === 0) {
                toggleTabButton({target: tabButtons[j]});
            }
        }
    }

    // Make nav items clickable to collapse/expand their content.
    var navItems = document.querySelectorAll('nav .resource-group .heading');
    for (i = 0; i < navItems.length; i++) {
        navItems[i].onclick = toggleCollapseNav;

        // Show all by default
        toggleCollapseNav({target: navItems[i].children[0]});
    }

    var arr = Array.prototype.slice.call(document.querySelectorAll('.schema-container'))
    arr.map(function(item){
     
      // console.log('json',JSON.parse(item.innerHTML))
      result = [];
      var obj = JSON.parse(item.innerHTML);
      if(obj.properties){
        objParse(obj.properties,0);
      }else{
        objParse(obj,0);
      }
      var divContainer = [];
      result.map(function(item){
       var str = '--  ' + item.name +'  '+ item.type +'('+item.description+')'
       var clName = 'params-level-'+item.level
       var style = 'padding-left:' + 15 * item.level + 'px;'
       divContainer.push('<div class='+clName+' style='+style+'>'+str+'</div>')
      })
      divContainer = divContainer.join('');
      item.innerHTML = divContainer;
      // console.log('result',result,divContainer)
    })

   
}

// Initial call to set up buttons
init();





window.onload = function () {
    autoCollapse();
    // Remove the `preload` class to enable animations
    document.querySelector('body').className = '';
};
