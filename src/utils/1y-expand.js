var lineBreakRegex=/\r?\n/g;
var itemSeparatorRegex=/[,\s*]/g;
function parseSequenceElement(s,i){
  if (s.indexOf("v")==-1||!isFinite(Number(s.substring(s.indexOf("v")+1)))){
    var numval=Number(s);
    return {
      value:numval,
      position:i,
      parentIndex:-1
    };
  }else{
    return {
      value:Number(s.substring(0,s.indexOf("v"))),
      position:i,
      parentIndex:Math.max(Math.min(i-1,Number(s.substring(s.indexOf("v")+1))),-1),
      forcedParent:true
    };
  }
}
function calcMountain(s){
  //if (!/^(\d+,)*\d+$/.test(s)) throw Error("BAD");
  var lastLayer;
  if (typeof s=="string"){
    lastLayer=s.split(itemSeparatorRegex).map(parseSequenceElement);
  }
  else lastLayer=s;
  var calculatedMountain=[lastLayer]; //rows
  while (true){
    //assign parents
    var hasNextLayer=false;
    for (var i=0;i<lastLayer.length;i++){
      if (lastLayer[i].forcedParent){
        if (lastLayer[i].parentIndex!=-1) hasNextLayer=true;
        continue;
      }
      var p;
      if (calculatedMountain.length==1){
        p=lastLayer[i].position+1;
      }else{
        p=0;
        while (calculatedMountain[calculatedMountain.length-2][p].position<lastLayer[i].position+1) p++;
      }
      while (true){
        if (p<0) break;
        var j;
        if (calculatedMountain.length==1){
          p--;
          j=p-1;
        }else{ //ignoring
          p=calculatedMountain[calculatedMountain.length-2][p].parentIndex;
          if (p<0) break;
          j=0;
          while (lastLayer[j].position<calculatedMountain[calculatedMountain.length-2][p].position-1) j++;
        }
        if (j<0||j<lastLayer.length-1&&lastLayer[j].position+1!=lastLayer[j+1].position) break;
        if (lastLayer[j].value<lastLayer[i].value){
          lastLayer[i].parentIndex=j;
          hasNextLayer=true;
          break;
        }
      }
    }
    if (!hasNextLayer) break;
    var currentLayer=[];
    calculatedMountain.push(currentLayer);
    for (var i=0;i<lastLayer.length;i++){
      if (lastLayer[i].parentIndex!=-1){
        currentLayer.push({value:lastLayer[i].value-lastLayer[lastLayer[i].parentIndex].value,position:lastLayer[i].position-1,parentIndex:-1});
      }
    }
    lastLayer=currentLayer;
  }
  return calculatedMountain;
}
function calcDiagonal(mountain){
  var diagonal=[];
  var diagonalTree=[];
  for (var i=0;i<mountain[0].length;i++){ //only one diagonal exists for each left-side-up diagonal line
    for (var j=mountain.length-1;j>=0;j--){ //prioritize the top
      var k=0;
      while (mountain[j][k]&&mountain[j][k].position+j<i) k++;
      if (!mountain[j][k]||mountain[j][k].position+j!=i) continue;
      var height=j;
      var lastIndex=k;
      while (true){
        if (height==0){
          lastIndex=mountain[height][lastIndex].parentIndex;
        }else{
          var l=0; //find right-down
          while (mountain[height-1][l].position!=mountain[height][lastIndex].position+1) l++;
          l=mountain[height-1][l].parentIndex; //go to its parent=left-down
          var m=0; //find up-left of that=left
          while (mountain[height][m].position<mountain[height-1][l].position-1) m++;
          if (mountain[height][m].position==mountain[height-1][l].position-1){ //left exists
            lastIndex=m;
          }else{
            height--;
            lastIndex=l;
          }
        }
        if (!mountain[height][lastIndex]||mountain[height][lastIndex].parentIndex==-1){
          diagonal.push(mountain[j][k].value);
          diagonalTree.push((mountain[height][lastIndex]?mountain[height][lastIndex].position:-1)+height);
          break;
        }
      }
      break;
    }
  }
  var pw=[];
  for (var i=0;i<diagonal.length;i++){
    var p=-1;
    for (var j=i-1;j>=0;j--){
      if (diagonal[j]<diagonal[i]){
        p=j;
        break;
      }
    }
    pw.push(p);
  }
  var r=[];
  for (var i=0;i<diagonal.length;i++){
    var p=i;
    while (true){
      p=diagonalTree[p];
      if (p<0||diagonal[p]<diagonal[i]) break;
    }
    if (p==pw[i]) r.push(diagonal[i]);
    else r.push(diagonal[i]+"v"+p);
  }
  //console.log(diagonalTree);
  return r.join(",");
}
function cloneMountain(mountain){
  if(mountain[0].length === undefined)return calcMountain(mountain.join(","));
  var newMountain=[];
  for (var i=0;i<mountain.length;i++){
    var layer=[];
    for (var j=0;j<mountain[i].length;j++){
      layer.push({
        value:mountain[i][j].value,
        position:mountain[i][j].position,
        parentIndex:mountain[i][j].parentIndex,
        forcedParent:mountain[i][j].forcedParent
      });
    }
    newMountain.push(layer);
  }
  return newMountain;
}
function getBadRoot(s){
  var mountain;
  if (typeof s=="string") mountain=calcMountain(s);
  else mountain=cloneMountain(s);
  var diagonal=calcMountain(calcDiagonal(mountain));
  if (diagonal[0][diagonal[0].length-1].value!=1){
    return getBadRoot(diagonal);
  }else{
    for (var i=mountain.length-1;i>=0;i--){
      if (mountain[i][mountain[i].length-1].position+i==mountain[0].length-1) return mountain[i-1][mountain[i-1][mountain[i-1].length-1].parentIndex].position+i-1;
    }
  }
}
export function expand(s,n,stringify){
  var mountain;
  if (typeof s=="string") mountain=calcMountain(s);
  else mountain=cloneMountain(s);
  var result=cloneMountain(mountain);
  if (mountain[0][mountain[0].length-1].parentIndex==-1){
    result[0].pop();
  }else{
    var result=cloneMountain(mountain);
    var cutHeight=mountain.length-1;
    while (mountain[cutHeight][mountain[cutHeight].length-1].position+cutHeight!=mountain[0].length-1) cutHeight--;
    var actualCutHeight=cutHeight;
    var badRootSeam=getBadRoot(mountain);
    var badRootHeight;
    var diagonal=calcMountain(calcDiagonal(mountain));
    var newDiagonal;
    var yamakazi=diagonal[0][diagonal[0].length-1].value==1; //Yamakazi-Funka dualilty
    if (yamakazi){
      newDiagonal=cloneMountain(diagonal);
      newDiagonal[0].pop();
      for (var i=0;i<n;i++){
        for (var j=badRootSeam;j<mountain[0].length-1;j++){
          newDiagonal[0].push(newDiagonal[0][j]); //who cares about mountains in diagonal?
        }
      }
      cutHeight--;
      badRootHeight=cutHeight;
    }else{
      newDiagonal=expand(diagonal,n,false);
      badRootHeight=mountain.length-1;
      while (true){
        var i=0;
        while (mountain[badRootHeight][i]&&mountain[badRootHeight][i].position+badRootHeight<badRootSeam) i++;
        if (mountain[badRootHeight][i]&&mountain[badRootHeight][i].position+badRootHeight==badRootSeam) break;
        badRootHeight--;
      }
    }
    for (var i=0;i<=actualCutHeight;i++) result[i].pop(); //cut child
    if (!result[result.length-1].length) result.pop();
    var afterCutHeight=result.length;
    var afterCutMountain=cloneMountain(result);
    var afterCutLength=result[0].length;
    var badRootSeamHeight=afterCutHeight-1;
    while (true){
      var l=0;
      while (mountain[badRootSeamHeight][l]&&mountain[badRootSeamHeight][l].position+badRootSeamHeight<badRootSeam) l++;
      if (mountain[badRootSeamHeight][l]&&mountain[badRootSeamHeight][l].position+badRootSeamHeight==badRootSeam) break;
      badRootSeamHeight--;
    }
    badRootSeamHeight++;
    //Create Mt.Fuji shell
    for (var i=1;i<=n;i++){ //iteration
      for (var j=badRootSeam;j<afterCutLength;j++){ //seam
        var isAscending;
        var p=0; //simplified; may not work
        while (mountain[badRootHeight][p].position+badRootHeight<j) p++;
        if (mountain[badRootHeight][p].position+badRootHeight==j){
          while (true){
            if (!mountain[badRootHeight][p]||mountain[badRootHeight][p].position+badRootHeight<badRootSeam){
              isAscending=false;
              break;
            }
            if (mountain[badRootHeight][p].position+badRootHeight==badRootSeam){
              isAscending=true;
              break;
            }
            p=mountain[badRootHeight][p].parentIndex;
          }
        }else{
          isAscending=false;
        }
        var seamHeight=afterCutHeight-1;
        while (true){
          var l=0;
          while (mountain[seamHeight][l]&&mountain[seamHeight][l].position+seamHeight<j) l++;
          if (mountain[seamHeight][l]&&mountain[seamHeight][l].position+seamHeight==j) break;
          seamHeight--;
        }
        seamHeight++;
        var isReplacingCut=j==badRootSeam;
        //console.log([j,seamHeight]);
        if (isAscending){
          for (var k=0;k<seamHeight+(cutHeight-badRootHeight)*i;k++){
            if (!result[k]) result.push([]);
            if (k<badRootHeight){ //Bb
              var sy=k;
              var sx;
              if (isReplacingCut){
                sx=mountain[sy].length-1;
              }else{
                sx=0;
                while (mountain[sy][sx].position+sy<j) sx++;
              }
              var sourceParentIndex=mountain[sy][sx].parentIndex;
              var parentShifts=i-isReplacingCut;
              var parentPosition=mountain[sy][sourceParentIndex]?mountain[sy][sourceParentIndex].position+parentShifts*(afterCutLength-badRootSeam)*(mountain[sy][sourceParentIndex].position+sy>=badRootSeam)-(k-sy):-1;
              var parentIndex=0;
              while (result[k][parentIndex]&&result[k][parentIndex].position<parentPosition) parentIndex++;
              if (!result[k][parentIndex]||result[k][parentIndex].position!=parentPosition) parentIndex=-1;
              result[k].push({
                value:parentIndex==-1?newDiagonal[0][j+(afterCutLength-badRootSeam)*i].value:NaN,
                position:j+(afterCutLength-badRootSeam)*i-k,
                parentIndex:parentIndex,
                forcedParent:mountain[sy][sx].forcedParent
              });
            }else if (k<=badRootHeight+(cutHeight-badRootHeight)*(i-isReplacingCut)){ //Br replace
              var sy=badRootHeight;
              var sx;
              if (!yamakazi&&isReplacingCut){
                sx=mountain[sy].length-1;
              }else{
                sx=0;
                while (mountain[sy][sx].position+sy<j) sx++;
              }
              var sourceParentIndex=mountain[sy][sx].parentIndex;
              var parentShifts=i-isReplacingCut;
              var parentPosition=mountain[sy][sourceParentIndex]?mountain[sy][sourceParentIndex].position+parentShifts*(afterCutLength-badRootSeam)*(mountain[sy][sourceParentIndex].position+sy>=badRootSeam)-(k-sy):-1;
              var parentIndex=0;
              while (result[k][parentIndex]&&result[k][parentIndex].position<parentPosition) parentIndex++;
              if (!result[k][parentIndex]||result[k][parentIndex].position!=parentPosition) parentIndex=-1;
              result[k].push({
                value:parentIndex==-1?newDiagonal[0][j+(afterCutLength-badRootSeam)*i].value:NaN,
                position:j+(afterCutLength-badRootSeam)*i-k,
                parentIndex:parentIndex,
                forcedParent:mountain[sy][sx].forcedParent
              });
            }else if (isReplacingCut&&k<=badRootHeight+(cutHeight-badRootHeight)*i){ //Br extend
              var sy=k-(cutHeight-badRootHeight)*(i-1);
              var sx;
              if (!yamakazi&&isReplacingCut){
                sx=mountain[sy].length-1;
              }else{
                sx=0;
                while (mountain[sy][sx].position+sy<j) sx++;
              }
              var sourceParentIndex=mountain[sy][sx].parentIndex;
              var parentShifts=i-isReplacingCut;
              var parentPosition=mountain[sy][sourceParentIndex]?mountain[sy][sourceParentIndex].position+parentShifts*(afterCutLength-badRootSeam)*(mountain[sy][sourceParentIndex].position+sy>=badRootSeam)-(k-sy):-1;
              var parentIndex=0;
              while (result[k][parentIndex]&&result[k][parentIndex].position<parentPosition) parentIndex++;
              if (!result[k][parentIndex]||result[k][parentIndex].position!=parentPosition) parentIndex=-1;
              result[k].push({
                value:parentIndex==-1?newDiagonal[0][j+(afterCutLength-badRootSeam)*i].value:NaN,
                position:j+(afterCutLength-badRootSeam)*i-k,
                parentIndex:parentIndex,
                forcedParent:mountain[sy][sx].forcedParent
              });
            }else{ //Be
              //if (isReplacingCut) console.warn("Climbing doesn't all the way. Makes sense.");
              var sy=k-(cutHeight-badRootHeight)*i;
              var sx;
              if (!yamakazi&&isReplacingCut){
                sx=mountain[sy].length-1;
              }else{
                sx=0;
                while (mountain[sy][sx].position+sy<j) sx++;
              }
              var sourceParentIndex=mountain[sy][sx].parentIndex;
              var parentShifts=i-isReplacingCut;
              var parentPosition=mountain[sy][sourceParentIndex]?mountain[sy][sourceParentIndex].position+parentShifts*(afterCutLength-badRootSeam)*(mountain[sy][sourceParentIndex].position+sy>=badRootSeam)-(k-sy):-1;
              var parentIndex=0;
              while (result[k][parentIndex]&&result[k][parentIndex].position<parentPosition) parentIndex++;
              if (!result[k][parentIndex]||result[k][parentIndex].position!=parentPosition) parentIndex=-1;
              result[k].push({
                value:parentIndex==-1?newDiagonal[0][j+(afterCutLength-badRootSeam)*i].value:NaN,
                position:j+(afterCutLength-badRootSeam)*i-k,
                parentIndex:parentIndex,
                forcedParent:mountain[sy][sx].forcedParent
              });
            }
          }
        }else{
          if (isReplacingCut) console.warn("Cut child and not connected to bad root. Makes sense.");
          for (var k=0;k<seamHeight;k++){
            if (!result[k]) result.push([]);
            //if statement is here to line up indents
            if (true){ //Bb
              var sy=k;
              var sx;
              if (isReplacingCut){
                sx=mountain[sy].length-1;
              }else{
                sx=0;
                while (mountain[sy][sx].position+sy<j) sx++;
              }
              var sourceParentIndex=mountain[sy][sx].parentIndex;
              var parentShifts=i-isReplacingCut;
              var parentPosition=mountain[sy][sourceParentIndex]?mountain[sy][sourceParentIndex].position+parentShifts*(afterCutLength-badRootSeam)*(mountain[sy][sourceParentIndex].position+sy>=badRootSeam)-(k-sy):-1;
              var parentIndex=0;
              while (result[k][parentIndex]&&result[k][parentIndex].position<parentPosition) parentIndex++;
              if (!result[k][parentIndex]||result[k][parentIndex].position!=parentPosition) parentIndex=-1;
              result[k].push({
                value:parentIndex==-1?newDiagonal[0][j+(afterCutLength-badRootSeam)*i].value:NaN,
                position:j+(afterCutLength-badRootSeam)*i-k,
                parentIndex:parentIndex,
                forcedParent:mountain[sy][sx].forcedParent
              });
            }
          }
        }
      }
    }
  }
  //Build number from ltr, ttb
  for (var i=result.length-1;i>=0;i--){
    if (!result[i].length){
      result.pop();
      continue;
    }
    for (var j=0;j<result[i].length;j++){
      if (!isNaN(result[i][j].value)) continue;
      var k=0; //find left-up
      while (result[i+1][k].position<result[i][j].position-1) k++;
      if (result[i+1][k].position!=result[i][j].position-1) throw Error("Mountain not complete");
      result[i][j].value=result[i][result[i][j].parentIndex].value+result[i+1][k].value;
    }
  }
  var rr;
  if(stringify == 2){
    rr=[];
    for (var i=0;result[0]&&i<result[0].length;i++){
      rr.push(result[0][i].value);
    }
  }else if (stringify){
    rr=[];
    for (var i=0;result[0]&&i<result[0].length;i++){
      rr.push(result[0][i].value+(result[0].forcedParent?"v"+result[0].parentIndex:""));
    }
    rr=rr.join(",");
  }else{
    rr=result;
  }
  return rr;
}
