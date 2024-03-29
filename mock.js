//get file data
var fs = require('fs');
var arg = process.argv;
var ChineseCharacters = '百度移动云搜索钱包开疆拓土';
ChineseCharacters = ChineseCharacters.split('');
var AsciaCharacters = 'abcdefghigklmnopqrstuvwsyzABCDEFGHIGKLMNOPQRSTUVWXYZ';
AsciaCharacters = AsciaCharacters.split('');
var numberCharacters = '0123456789';
numberCharacters = numberCharacters.split('');
if(arg.length !==4){
    console.log('usage: node mock.js filePath resultFilePath');
	return -1;
}
function isArray(obj){
   return Object.prototype.toString.call(obj) === "[object Array]" ?true: false; 
}
function isObject(obj){
   return (Object.prototype.toString.call(obj) === "[object Object]")? true : false; 
}	
var filePath = process.argv[2];
var resultFilePath = process.argv[3];
//var dirName = process.argv.[1]
var mockFileContent = fs.readFileSync(filePath,{encoding:'utf8'});
//parse as json
var jsonContent = JSON.parse(mockFileContent);
//recrusive parse object
function mock(obj){
    for(var i in obj){
        if( obj.hasOwnProperty(i) ){
            if( isObject(obj[i] ) ){
                mock(obj[i]);
			}else{
				generateData(obj,[i],obj[i]);
			}
		}
	}
}
function writeJsonToFile(jsonData,fileName){
    var jsonData = JSON.stringify(jsonData,null,4);
	fs.writeFileSync(fileName,jsonData);
}

function generateData(context,arr,patterns){
	if(typeof patterns == 'number'){
        context[arr] = patterns;
		return 0;
	}
	var actionMap = {
        'a' : generateStr,
		'1' : generateNum,
		'一': generateChineseCharacter,
		'[]': generateArr,
		'{}': generateObj
	};
	var pattern ;
    isArray(arr)?arr:arr=[arr];
	patterns = !isArray(patterns)?patterns.split('|'):patterns;
	pattern = patterns.shift();
	pattern = pattern.split(',');
	var p,type,property,ps;
	if( arr.length !== pattern.length){
        console.log(arr , 'not match ',pattern);	
		return -1;
	}
	for(var i = 0 ,len = arr.length ;i<len ;i++){
        p = pattern[i];
	    type = p.split('@')[0];
	    property = p.split('@')[1];	 
		if(actionMap[type]){
		    actionMap[type](context,arr[i],property,patterns);
		}else{
			context[arr[i]] = type;
		}
	}
}

function generateChineseCharacter(context,p,ccPattern){
    context[p] = generateCharacter(ccPattern,ChineseCharacters);
}
function generateCharacter(pattern,characterArr){
    var rangePattern = /\[(\d+)\s*-(\d+)\]/;
	var rangeLeftLimit ,rangeRightLimit,match;
	if(rangePattern.test(pattern)){
       match = pattern.match(rangePattern);
	   rangeLeftLimit = parseInt(match[1]||1);
	   rangeRightLimit = parseInt(match[2]||10);
	}

    rangeLeftLimit?true: rangeLeftLimit = parseInt(pattern);
	rangeRightLimit?true: rangeRightLimit= rangeLeftLimit;
	var character=null;
	var result = [];
    var len =rangeLeftLimit+Math.random()*(rangeRightLimit - rangeLeftLimit) || 1;
	var clen = characterArr.length;
    for(var i = 0 ;i<len; i++){
	    character = characterArr[parseInt((Math.random()*clen))] || 'a';
        result.push(character);
	}
	return result.join('');	
};
function generateNum(context,p,numPattern){
    var rangePattern = /\[(\d+)\s*-(\d+)\]/;
	var rangeLeftLimit ,rangeRightLimit,match;
	if(rangePattern.test(numPattern)){
       match = numPattern.match(rangePattern);
	   rangeLeftLimit = parseInt(match[1]||1);
	   rangeRightLimit = parseInt(match[2]||10);
	   context[p] =  parseInt( Math.random()*(rangeRightLimit - rangeLeftLimit)) + rangeLeftLimit;
	}else{
        context[p] =  '-1';
	}
}

function generateStr(context,p,strPattern){
    context[p] =  generateCharacter(strPattern,AsciaCharacters);
}
function generateArr(context,p,attibute,patterns){
    context[ p ] = [];
	var ps = [];
	for(var j = 0 ;j<parseInt(attibute);j++){
        context[ p ].push(0);
		ps.push(j);
	    generateData(context[p],[j],patterns.slice(0));
	}
}
function generateObj(context,p,attibute,patterns){
            context [ p ] = {};
			var objProperty = attibute.split(':');
			ps = [];
			for(var j = 0 ;j<objProperty.length;j++){
                context[ p ][objProperty[j]] = null;
				ps.push(objProperty[j]);
			}
			generateData(context[p],ps,patterns);
}
mock(jsonContent);
writeJsonToFile(jsonContent,resultFilePath);
