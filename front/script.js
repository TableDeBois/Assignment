//const element = document.getElementById("chessboard");
const element = document.getElementsByClassName("chessboard");
let chessboardSize=8;
let queenPlace=[];


queenPlace=[6, 2, 7, 1, 4, 8, 5, 3];
for(let i=0;i<chessboardSize;i++){
    element.innerHTML+="<tr>";
    for(let j=0;j<chessboardSize;j++){
        if((i+j)%2==0){
            element.innerHTML+="<td class='white'>";
        }else{
            element.innerHTML+="<td class='black'>";
        }
        if(queenPlace[j]==j+1){
            element.innerHTML+="<img src='reine-noire.png' id='queen'>";
        }
        element.innerHTML+="</td>";
    }
    element .innerHTML+="</tr>";
}