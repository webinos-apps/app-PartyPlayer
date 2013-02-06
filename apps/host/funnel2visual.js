/*
 * Code contributed to the webinos project.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * (C) Copyright 2013, TNO, BMW Forschung & Technik GmbH
 * Author: Arno Pont, Martin Prins, Daryll Rinzema, Simon Isenberg
 */


/**
 *  Encapsulate the interaction between the funnel logic and the visual part of the funnel.
 *  funnel2visual registers the relevant callbacks for interaction
**/
var funnel2visual = (function(){

  var allItems = {}; //object to push all funnelVars
  funnel.onInit(function(circles){
    funnelViz.setupCircles(500, funnel.getCircles());
  }); 

  funnel.onAddItem(function(key){
    var fnO = funnelVar();
    allItems['key_' + key] = fnO;
    fnO.setKey(key);
    fnO.init();

    console.log('ALL ITEMS:');
    console.log(allItems);

  });

  funnel.onRemoveItem(function(key){
    var fnO = allItems['key_' + key];
    var sortedItems = funnel.getFunnel();

    funnelViz.destroySingle(allItems['key_' + key].getSelector());
    delete allItems['key_' + key];
    if(sortedItems[0]){
      if(sortedItems[0][1] >= funnel.getCircles()){

          funnelViz.setCenter(allItems['key_' + sortedItems[0][0]].getSelector());
      }
    }
  });

  funnel.onVoteItem(function(funnelItem, key){
        var circles = funnel.getCircles();
          //make the visual part update Item to next circle
        if(funnelItem.votes < circles){
            allItems['key_' + key].setCircle(circles + 1 - funnelItem.votes);
            funnelViz.updateCircle(allItems['key_' + key].getSelector(), allItems['key_' + key].getCircle());
        } else if (!funnel.nextItem && funnelItem.votes >= circles) {
            allItems['key_' + key].setCircle(circles + 1 - funnelItem.votes);
            funnelViz.setCenter(allItems['key_' + key].getSelector());
            funnel.nextItem = true;
        }
        
        if(funnel.nextItem && funnelItem.votes >= circles){
            if(funnelItem.votes >= oldSorted[0][1]){
                var oldItem = allItems['key_' + oldSorted[0][0]];
                oldItem.setCircle(2);
                funnelViz.updateCircle(oldItem.getSelector(), oldItem.getCircle());
                allItems['key_' + key].setCircle(1);
                funnelViz.setCenter(allItems['key_' + key].getSelector());
            }
        }
  });

  funnel.onAnimate(function(key){
    clearInterval(allItems['key_' + key].getInterval());
    funnelViz.animateToPlayer(allItems['key_' + key].getSelector());
    
  });

})();