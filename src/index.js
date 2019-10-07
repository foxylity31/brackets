module.exports = function check(str, bracketsConfig) {
    
    function process_it(instr){
        
        var str = instr;
        if (pairs.length){

            do {
                var t=str;
                for (var i =0, c=pairs.length;i<c;i++){                
                    t = t.replace(pairs[i],'');
                }
                var flag = ((str.length === t.length) || !t.length) ? false : true;
                str = t;
            } while (flag);
        }

        var l = str.length;
        if (!l){
            task_cache[instr]=true;
            return true;
        }            

        if (typeof task_cache[str] != 'undefined'){
            var r = task_cache[str];
            task_cache[instr]=r;
            return r;
        }

        var letters={}
        var symm = true;

        for (var i=0,c2=l/2;i<c2;i++){
            var letter_f = str.charAt(i);
            var letter_l = str.charAt(l-1-i);
            if (symm){
                
                if (letter_link[letter_f] == letter_f){
                   
                    if (letter_f != letter_l) symm=false;
                } else {
                    if (!letter_opens[letter_f] || (letter_l != letter_link[letter_f]) ){
                       
                        symm = false;
                    }
                }

            }
            if (typeof letters[letter_f] == 'undefined'){
                letters[letter_f]=1;
            } else {
                letters[letter_f]++;
            }
            if (typeof letters[letter_l] == 'undefined'){
                letters[letter_l]=1;
            } else {
                letters[letter_l]++;
            }                
        }
        if (symm){
            task_cache[instr]=true;
            return true;
        }

        for (var key in letters){
            var alt_letter = letter_link[key];
            
            if (letters[key] != letters[alt_letter]){
               
                return false;
            }

            if ((key == alt_letter) && (letters[key] % 2 == 1)){
                
                return false;
            }
        }
        return str;
    }


    function recursive_check(str){

        var key=null;
        var offset=-1;
        var c = str.length;
        var positions=[];
        for (var i=0;i<c;i++){
            var letter = str.charAt(i);
            if (dividers.indexOf(letter) != -1){
                key = letter;
                offset = i;
                break;
            }
        }
        if (!key || (i == c)){
            task_cache[str]=false;
            return false;
        }

        var pos = offset+1;

        while ((pos = str.indexOf(key,pos)) !== -1){
            if ((pos-offset-1) %2 == 0){                
              
                positions.push(pos);
            }
            pos++;
        }        

        while (positions.length){
            var last_pos = positions.pop();
            var inner = str.slice(offset+1,last_pos);
            var outer = str.slice(0,offset) + str.slice(last_pos+1);

            if (outer.length < inner.length){
                

                outer = process_it(outer);
                if (outer === false) continue;

                inner = process_it(inner);
                if (inner === false) continue;



                if (outer === true || recursive_check(outer)){
                    if (inner === true || recursive_check(inner)){
                        task_cache[str]=true;
                        return true;
                    }
                }

            } else {
                

                inner = process_it(inner);
                if (inner === false) continue;

                outer = process_it(outer);
                if (outer === false) continue;


                if (inner === true || recursive_check(inner)){
                    if (outer === true || recursive_check(outer)){                            
                        task_cache[str]=true;
                        return true;
                    }
                }
            }

        }
       
        task_cache[str]=false;
        return false;
    }

    
    if (str.length % 2 == 1){
       
        return false;
    }
   
    pairs = []; 
    dividers = []; 
    letter_link={}; 
    letter_opens={}
    task_cache={'':true}; 
    var all_letters={};

    for (var i=0,c=str.length;i<c;i++){
        var letter = str.charAt(i);
        if (typeof all_letters[letter] == 'undefined'){
            all_letters[letter]=1;
        }
    }

    for (var i=0,c=bracketsConfig.length;i<c;i++){            
        var t1 = typeof all_letters[bracketsConfig[i][0]];
        var t2 = typeof all_letters[bracketsConfig[i][1]];
        if ( t1 != t2){
            
            return false;
        }

        if (t1 == 'undefined'){
            
            continue;
        }

        if (bracketsConfig[i][0] == bracketsConfig[i][1]){
            
            dividers.push(bracketsConfig[i][0]);
            letter_link[bracketsConfig[i][0]]=bracketsConfig[i][1];
            var letters = bracketsConfig[i][0]+bracketsConfig[i][0];
            for (var j=1;j<5;j++) task_cache[letters.repeat(j)]=true;                
        } else {
            
            letter_link[bracketsConfig[i][0]]=bracketsConfig[i][1];
            letter_link[bracketsConfig[i][1]]=bracketsConfig[i][0];
            letter_opens[bracketsConfig[i][0]]=true;
            letter_opens[bracketsConfig[i][1]]=false;
            pairs.push(bracketsConfig[i][0] + bracketsConfig[i][1]);
        }
    }

    var str = process_it(str);
    if (typeof str != 'string'){
        return str;
    }
    return recursive_check(str);
}
