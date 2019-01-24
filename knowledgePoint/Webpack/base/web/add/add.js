import $ from '../jquery';
import './add.css';

function move(){
    $(function(){
        $("div").css({"color":"red"})
    })
    
};
let a=1;
let b=2;
export {
    move as move,
    a as a,
    b as b,
}
