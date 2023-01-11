//时间模块
//60秒一天，一星期七天
var time = document.querySelector('.time');
var nowTime = 0;
function timeCount(){
    nowTime++;
    var week = parseInt(nowTime / 60 / 7) + 1;
    time.children[0].innerHTML = "W" + week;
    // console.log(week);
    var day = parseInt(nowTime / 60 % 7) + 1;
    time.children[1].innerHTML = "D" + day;
    // console.log(day);
}
timeCount();
setInterval(timeCount,1000);


//金钱模块
var allMoney = 500;
var money = document.querySelector('.money');
function moneyCount(){
    money.firstElementChild.innerHTML = "" + allMoney;
}
moneyCount();
setInterval(moneyCount,1000);

//欢迎模块
var welcome = document.querySelector('.welcome');
setTimeout(function() {
    welcome.parentNode.style.display = 'block';
},500);
welcome.querySelector('.button').addEventListener('click',function() {
    welcome.parentNode.style.display = 'none';
})

//每三十秒提示查看一次是否有空位和等候的客人
setInterval(function() {
    for(var i = 0; i < 4; i++){
        //餐厅有空位 并且等候区不为空
        if(customers.children[i].className == 'charatericon emptytable' && waiting.children[0].getAttribute('data-isWaiting') == '1'){
            var empty = document.querySelector('.empty');
            empty.style.display = 'block';
            //两秒后关闭
            setTimeout(function(){
                empty.style.display = 'none';
            },3000);
        }
    }
},30000);



//厨师与顾客模块
var cooks = document.querySelector('.cooks');                       //取得厨师区块，其子元素为厨师
var addCook = cooks.querySelector('.addcook');                      //获取添加顾客按钮
var recruitment = document.querySelector('.recruitment');           //获得招聘信息页面
var recruitmentbutton = recruitment.querySelectorAll('button');     //获取两个按钮
var dismiss = document.querySelector('.dismiss');                   //获取解雇信息页面
var dismissbutton = dismiss.querySelectorAll('button');             //获取两个按钮
var customers = document.querySelector('.customers');               //取得顾客区块，其子元素为桌子ss
var emptytables = customers.querySelectorAll('.emptytable')         //取得空桌子
var waiting = document.querySelector('.waiting')                    //取得等待区块，其子元素为等待区顾客



var cooksSalary = [100,110,120,130,140,150];                        //厨师招聘信息（各个厨师的月薪）最多六个厨师，价格以此排列
var chefs = [];                                                     //厨师数组
function Cook(cookEle,cookSalary,num) {
    this.workTime = 0;
    this.cookEle = cookEle;                                         //厨师元素
    this.cookSalary = cookSalary;                                   //厨师每月工资
    this.num = num;                                                 //厨师的索引
    this.isDelete = false;                                          //是否创建了删除操作
}
//添加厨师 添加点击事件
addCook.addEventListener('click',function() {
    //修改将招聘的厨师的价格
    recruitment.children[3].innerHTML = recruitment.children[3].innerHTML.substring(0,15) + cooksSalary[cooks.children.length - 1];
    //显示招聘信息
    recruitment.parentNode.style.display = 'block';
})
//添加招聘信息页面点击事件
//第一个按钮为确认
recruitmentbutton[0].addEventListener('click',function() {
    //创建一个厨师div，并初始化信息
    var cook = document.createElement('div');
    cook.className = "charatericon restcook";
    cook.innerHTML = '<img class="iconsize" src="" alt=""><div class="cookingdish"><div class="color"></div><div class="name"></div></div><div class="deletecook">x</div><div class="finish"></div>';
    //将该div存储的厨师的数组编号储存这data-cooknum中
    cook.querySelector('.deletecook').setAttribute('data-cooknum',cooks.children.length - 1);
    //将厨师信息存入对象中
    chefs[cooks.children.length - 1] = new Cook(cook,cooksSalary[cooks.children.length - 1],cooks.children.length - 1);
    console.log('创建了第'+cooks.children.length+'个厨师,工资为'+chefs[cooks.children.length - 1].cookSalary);
    //设置工资发放计时器，内置已经将计时器给厨师
    add(chefs[cooks.children.length - 1]);
    //在最后一个元素前添加厨师
    cooks.insertBefore(cook,cooks.children[cooks.children.length - 1]);
    //满人后删除添加按钮
    if(cooks.children.length > 6){
        cooks.removeChild(cooks.children[cooks.children.length - 1]);
    }
    cooksbox();

    cook.querySelector('.deletecook').addEventListener('click',function() {
        // console.log('deletecook---data-cooknum == ' + this.getAttribute('data-cooknum'));
        dismiss.setAttribute('data-cooknum',this.getAttribute('data-cooknum'));
        //计算违约金 修改内容
        var num = Number(this.getAttribute('data-cooknum')) ;
        var money = Math.floor( (((chefs[num].workTime % 3) / 3) + 1) * chefs[num].cookSalary );
        dismiss.children[4].innerHTML = dismiss.children[4].innerHTML.substring(0,20) + money;
        dismiss.parentNode.style.display = 'block';
    })
    //隐藏招聘信息
    recruitment.parentNode.style.display = 'none';

    var cooknumber = document.querySelector('.cooknumber');
    cooknumber.querySelector('p').innerHTML = cooknumber.querySelector('p').innerHTML.substring(0,12) + chefs.length + cooknumber.querySelector('p').innerHTML.substring(13);
    cooknumber.style.display = 'block';
    setTimeout(function() {
        cooknumber.style.display = 'none';
    },3000);
})
//确定解雇事件添加
dismissbutton[0].addEventListener('click',function() {
    var num = Number(dismiss.getAttribute('data-cooknum'));
    // console.log('num = ' + num);
    //计算金额是否足够支付违约金(厨师未发工资的该周需发的工资 加上一周工资的违约金)
    var money = Math.floor( (((chefs[num].workTime % 420) / 420) + 1) * chefs[num].cookSalary );
    // console.log('worktime = '+chefs[num].workTime);
    // console.log('salary = '+money);
    //如果不足以支付则返回
    if(allMoney < money){
        //违约金不足支付提示
        var nomoney = document.querySelector('.nomoney');
        nomoney.style.display = 'block';
        setTimeout(function() {
            nomoney.style.display = 'none';
        },3000);
        return;
    }
    allMoney -= money;
    for(var i = num + 1; i < cooks.children.length; i++){
        //如果是添加按钮
        if(cooks.children[i].className == 'charatericon addcook'){
            break;
        } else {
            cooks.children[i].querySelector('.deletecook').setAttribute('data-cooknum',i - 1);
        }
    }
    
    //关闭工资发放计时器
    clearInterval(chefs[num].timer);
    //移除元素
    cooks.removeChild(chefs[num].cookEle);
    //重新布局cooks区块
    cooksbox();
    //在数组中移除该厨师
    chefs.splice(num,1);
    // console.log(chefs);
    dismiss.parentNode.style.display = 'none';

    //解约成功提示
    var paymoney = document.querySelector('.paymoney');
    paymoney.querySelector('p').innerHTML = paymoney.querySelector('p').innerHTML.substring(0,14) + money;
    paymoney.style.display = 'block';
    setTimeout(function() {
        paymoney.style.display = 'none';
    },3000);
})
dismissbutton[1].addEventListener('click',function() {
    dismiss.parentNode.style.display = 'none';
})
//添加厨师工资发放计时器函数
function add(cook) {
    cook.timer = setInterval(function() {
        //破产了
        if(allMoney < cook.cookSalary){
            clearInterval(cook.timer);
        }
        //输出该厨子的信息
        // console.log(cook);
        cook.workTime++;
        //每420秒结算工资
        if((cook.workTime % 420) == 0){
            allMoney = allMoney - cook.cookSalary;
        }
    },1000);
}
//取消招聘事件添加
recruitmentbutton[1].addEventListener('click',function() {
    recruitment.parentNode.style.display = 'none';
})
//规划厨师盒子大小
function cooksbox(){
    //数量大于三时改变盒子的大小，以及调整与下一个盒子的距离
    if(cooks.children.length > 3){
        cooks.style.height = "240px";
        customers.style.margin = "0 20px 0 20px";
    } else {
        cooks.style.height = "120px";
        customers.style.margin = "140px 20px 0 20px";
    }
}

addcustomer();
setInterval(addcustomer,10000);
//等待区添加顾客
function addcustomer() {
    var time = Math.floor(Math.random() * 9) * 1000;              //产生一个0~9的随机整数后乘以1000
    // console.log(time);
    //随机间隔n秒产生一个顾客
    setTimeout(function() {
        for(var i = waiting.children.length - 1; i >= 0; i--){
            if(waiting.children[5].getAttribute('data-isWaiting') == '1'){
                console.log('等待区已满！');
                break;
            }
            // console.log(i + " = " + waiting.children[i].getAttribute('data-isWaiting'));
            if(waiting.children[i].getAttribute('data-isWaiting') == '1'){
                waiting.children[i + 1].className = waiting.children[i].className;
                waiting.children[i + 1].setAttribute('data-isWaiting','1');             //表示其已有人在等候
                waiting.children[i + 1].style.display = 'block'
            }
        }
        //等待区非满人才加人
        if(waiting.children[5].getAttribute('data-isWaiting') == '0'){
            var str1 = waiting.children[0].className.substring(0,12);                   
            var str2 = " customer" + (Math.floor(Math.random() * 6) + 1);               //在一到六中随机产生一个顾客
            waiting.children[0].className = str1 + str2;                                //给第一个位置添加新客人
            waiting.children[0].setAttribute('data-isWaiting','1');
            waiting.children[0].style.display = 'block';
        }

    },time);
}
waiting.addEventListener('click',function(e) {
    for(var i = waiting.children.length - 1; i >= 0; i--){
        //找最先进来的
        if(waiting.children[i].getAttribute('data-isWaiting') == '1'){
            //看点击的是不是第一个，不是直接退回，并提示
            if(e.target.parentNode.id == waiting.children[i].id){

                var str = e.target.parentNode.className.substring(13);
                // console.log(e.target.parentNode.className.substring(13));
                //菜单实时信息更改
                menu.parentNode.querySelector('h4').innerHTML = str + menu.parentNode.querySelector('h4').innerHTML.substring(9);
                menu.parentNode.querySelector('div').className = menu.parentNode.querySelector('div').className.substring(0,13) + str;
                //在等待区删除人
                waiting.children[i].setAttribute('data-isWaiting','0');             //该等待区位置没人
                waiting.children[i].style.display = 'none';                        //隐身该位置图像
                // console.log(menu.parentNode.querySelector('div').className);
                //显示菜单
                menu.parentNode.style.display = 'block';
                menu.parentNode.parentNode.style.display = 'block';

                break;
            } else {
                console.log('请点击第一个');
                break;
            }
        }
    }
})

//菜单
var menu = document.querySelector('.menu');                 //菜单中的form元素
var input = menu.getElementsByTagName('input');             //菜单中所有的选择按钮
var exit = document.querySelector('.exit');                 //退出按钮
var submit = document.querySelector('.submit');             //提交按钮
// menu.parentNode.parentNode.style.display = 'block';

function dish(name ,money) {
    this.name = name;
    this.money = money;
}

var dishes = [new dish('凉拌SAN',6),new dish('冷切DOM',4),new dish('UL炖LI',12),new dish('红烧HEAD',15),new dish('酥炸ECharts',18),new dish('炙烤CSS',16),new dish('清蒸DIV',12),new dish('鲜榨flex',5),new dish('小程序奶茶',6)];

for(var i = 0; i < input.length - 1; i++){
    input[i].addEventListener('click',function() {
        var menuMoney = 0;
        for(var j = 0; j < input.length - 1; j++) {
            if(input[j].checked){
                menuMoney = menuMoney + Number(dishes[input[j].getAttribute('data-index')].money);
            }
        }
        var str1 = menu.parentNode.querySelector('h4').innerText.substring(0,18);
        menu.parentNode.querySelector('h4').innerText = str1 + menuMoney +" 元的菜";
        var min;
        var max;
        //第一部分
        if(this.getAttribute('data-index') < 2 && this.getAttribute('data-index') >= 0){
            min = 0;
            max = 2;
        } else if (this.getAttribute('data-index') < 7) {
            min = 2;
            max = 7;
        } else {
            min = 7;
            max = 9;
        }
        var str = "";
        if(this.checked){
            str = "disabled";
        }
        for(var j = min; j < max; j++){
            if(!input[j].checked){
                input[j].disabled = str;
            }
        }
    })
}
function judge(temp){
    //遍历三道菜，看是否都处于完成或者超时
    //该顾客能否离开（0 不能， 1 可以）
    var isGo = '1';
    //是否全部过期
    var isAllExpire = 'true';
    for(var k = 0; k < 3; k++){
        //选择了该菜
        // console.log('c = '+temp.querySelectorAll('.foodname')[k].getAttribute('data-isChoose'));
        // console.log('e = '+temp.querySelectorAll('.foodname')[k].getAttribute('data-isExpire'));
        // console.log('f = '+temp.querySelectorAll('.foodname')[k].getAttribute('data-isFinish'));
        if(temp.querySelectorAll('.foodname')[k].getAttribute('data-isChoose') == '1'){
            //该菜没过期
            if(temp.querySelectorAll('.foodname')[k].getAttribute('data-isExpire') == '0'){
                //不是所有菜都没上
                isAllExpire = 'false';
            }
            //如果有一个菜没过期没完成，就不能走
            if(temp.querySelectorAll('.foodname')[k].getAttribute('data-isExpire') == '0' && temp.querySelectorAll('.foodname')[k].getAttribute('data-isFinish') == '0'){
            isGo = '0';
            }
        }
        temp.querySelectorAll('.foodname')[k]
    }
    // console.log('data-igGo = '+isGo);
    // console.log('data-isAllExpire = '+isAllExpire);
    temp.setAttribute('data-isGo',isGo);
    temp.setAttribute('data-isAllExpire',isAllExpire);
}
//有菜品已超时，将厨师恢复休息态 str为菜名
function initcook(str){
    for(var i = 0; i < chefs.length; i++){
        //拿到厨师的菜名
        var cookstr = chefs[i].cookEle.querySelector('.name').innerHTML;
        //找到第一个做这个菜的厨师，并恢复休息
        if(cookstr == str){
            chefs[i].cookEle.className = 'charatericon restcook';
            break;
        }
    }
}
//为菜品添加进度条 并且在时间到了后将其划掉
function waitingcooking(table ,j){
    table.querySelectorAll('.servefood')[j].timer = dynamic(table.querySelectorAll('.foodname')[j].querySelector('.color') ,25);
    //清除上一次的计时器
    clearTimeout(table.querySelectorAll('.servefood')[j].temp);
    //二十秒后执行
    table.querySelectorAll('.servefood')[j].temp = setTimeout(function(){
        //菜品在到时还没完成
        if(table.querySelectorAll('.foodname')[j].getAttribute('data-isFinish') == '0'){
            
            //取得超时菜名
            var str = table.querySelectorAll('.foodname')[j].querySelector('.name').innerHTML;
            // console.log(table.querySelectorAll('.foodname')[j].querySelector('.name').innerHTML);
            initcook(str);
            table.querySelectorAll('.foodname')[j].setAttribute('data-isCooking','true');
            table.querySelectorAll('.foodname')[j].setAttribute('data-isExpire','1');
            table.querySelectorAll('.foodname')[j].querySelector('hr').style.display = 'block';
            table.querySelectorAll('.servefood')[j].style.display = 'none';
            table.querySelectorAll('.foodname')[j].className = table.querySelectorAll('.foodname')[j].className.substring(0,12) + " black";
            judge(table);
            chargemonitor();
        }

    },20000);
}
//初始化上菜
function initservefood(but){
    //遍历四张桌子
    for(var i = 0; i < 4; i++){
        //不是空桌子
        if(customers.children[i].className != 'charatericon emptytable'){
            //点击的菜名
            foodname = but.previousElementSibling.querySelector('.name').innerHTML;
            for(var j = 0; j < 3; j++){
                console.log(customers.children[i].querySelectorAll('.foodname')[j].querySelector('.name').innerHTML);
                console.log(foodname);
                if(customers.children[i].querySelectorAll('.foodname')[j].querySelector('.name').innerHTML == foodname){
                    console.log(customers.children[i].querySelectorAll('.foodname')[j].nextElementSibling);
                    customers.children[i].querySelectorAll('.foodname')[j].nextElementSibling.style.display = 'none';
                }
                // customers.children[i].querySelectorAll('.foodname')[j].querySelector('.name').innerHTML
            }
            // customers.children[i].querySelectorAll('.foodname')[j]
        }
    }
}
submit.addEventListener('click',function() {

    var isTrue = false;
    for(var i = 2; i < 7; i++){
        if(input[i].checked){
            isTrue = true;
            break;
        }
    }
    //如果没有选择必选项将退回
    if(!isTrue){
        return;
    }
    menu.parentNode.parentNode.style.display = 'none';
    //将已选的菜的索引号加入numbers数组中
    var numbers = [-1,-1,-1]
    var j = 0;
    for(var i = 0; i < 9; i++){
        if(input[i].checked){
            numbers[j] = i;
            j++;
        }
    }
    for(var i = 0; i < customers.children.length; i++){
        //空桌
        if(emptytables[i].className == 'charatericon emptytable'){
            emptytables[i].className = 'charatericon ' + menu.parentNode.children[0].className.substring(13) + ' occupiedtable'
            console.log('顾客' + menu.parentNode.children[0].className); 
            console.log('菜1 = ' + numbers[0] +'菜2 = ' + numbers[1] +'菜3 = ' + numbers[2]);
            //循环添加菜名
            for(var j = 0; j < numbers.length; j++){
                if(numbers[j] != -1){
                    // console.log('number = '+numbers[j]);
                    //将空桌子改为背景红色
                    emptytables[i].querySelectorAll('.foodname')[j].className = emptytables[i].querySelectorAll('.foodname')[j].className.substring(0,12) + ' red';
                    // console.log('j = '+j);
                    //将空桌子里面的菜名栏改文字为菜名
                    emptytables[i].querySelectorAll('.foodname')[j].querySelector('.name').innerHTML = dishes[numbers[j]].name;
                    //将菜的状态改为未做
                    emptytables[i].querySelectorAll('.foodname')[j].setAttribute('data-isCooking','false');
                    //修改背景颜色
                    emptytables[i].querySelectorAll('.foodname')[j].querySelector('.color').className = 'color darkred';
                    emptytables[i].querySelectorAll('.foodname')[j].style.display = 'block';
                    //添加是否过期属性 (0 没过期，1 过期)
                    emptytables[i].querySelectorAll('.foodname')[j].setAttribute('data-isExpire','0');
                    //添加是否完成属性 (0 没完成，1 完成)
                    emptytables[i].querySelectorAll('.foodname')[j].setAttribute('data-isFinish','0');
                    //添加是否点了属性 (0 没点，1 点了)
                    emptytables[i].querySelectorAll('.foodname')[j].setAttribute('data-isChoose','1');
                    //为菜品添加进度条 并且在时间到了后将其划掉 并改变样式
                    waitingcooking(emptytables[i],j);
                    //上菜按钮添加点击事件
                    emptytables[i].querySelectorAll('.servefood')[j].addEventListener('click',function() {
                        //上完菜按钮消失
                        this.style.display = 'none';
                        // console.log(this.previousElementSibling);
                        //清除等待进度条
                        clearInterval(this.timer);
                        //修改进度条背景颜色
                        this.previousElementSibling.className = this.previousElementSibling.className.substring(0,12) +' orange';
                        this.previousElementSibling.querySelector('.color').className = 'color darkorange';
                        //开始进食进度条
                        var temp = this;
                        //修改顾客样式
                        this.parentNode.className = this.parentNode.className.substring(0,22) + " eatingtable";
                        //修改菜品状态，为已完成
                        this.previousElementSibling.setAttribute('data-isFinish','1');
                        //进度条函数
                        dynamic(this.previousElementSibling.querySelector('.color') ,5);
                        setTimeout(function( ){
                            //将菜品改为绿色 表示已完成
                            temp.previousElementSibling.className = temp.previousElementSibling.className.substring(0,12) +' green';
                        },5000);

                        //通过函数包装保证在该计时器只存在最后一个点击的计时器
                        function eat(table ,time){
                            //每次调用前
                            clearTimeout(table.timer);
                            table.timer = setTimeout(function() {
                            //将客人变回等待
                            temp.parentNode.className = temp.parentNode.className.substring(0,22) + " occupiedtable";
                            chargemonitor();
                            },time);
                        }

                        eat(this.parentNode,5000);
                        
                        judge(this.parentNode);

                        for(var k = 0; k < chefs.length; k++){
                            // this.previousElementSibling.querySelector('.name').innerHTML
                            //通过菜名找到厨师
                            if(chefs[k].cookEle.querySelector('.name').innerHTML == this.previousElementSibling.querySelector('.name').innerHTML){
                                //让该菜厨师回归休息状态
                                chefs[k].cookEle.className = 'charatericon restcook';
                                break;
                            }
                        }

                        initservefood(this);
                    })
                }
            }
            break;
        }
    }
    init();
    
})
exit.addEventListener('click',function() {
    menu.parentNode.parentNode.style.display = 'none';
    init();
})

//初始化表单
function init() {
    for(var i = 0; i < input.length; i++){
        input[i].disabled = "";
        input[i].checked = false;
    }
    menu.parentNode.querySelector('h4').innerText = "customer 正在点菜，已点 0 元的菜";
}

function dynamic(color ,time){
    var init = 0.0;                                       //从零开始
    var step = 100.0/(time*2);                        //步距
    var timer = setInterval(function() {
        if(init >= 100){                                //满了清除计时器
            init = -1 * step;
            clearInterval(timer);
        }
        var data = new Date();
        console.log(data.getTime());
        console.log(init);
        init += step;
        color.style.width = '' + init + '%';
    },500);
    return timer;                                       //返回计时器，方便停止
}
//做菜并在做完将厨师变为完成状态
function cookedtofinish(chef){
    dynamic(chef.cookEle.querySelector('.cookingdish').querySelector('.color') ,10);
    setTimeout(function() {
        chef.cookEle.className = 'charatericon finishcook';
    },10000);
}

//初始化餐桌
function inittable(table){
    table.className = "charatericon emptytable";
    //将菜名隐藏
    for(var i = 0; i < 3; i++){
        table.querySelectorAll('.foodname')[i].style.display = 'none';
        table.querySelectorAll('.foodname')[i].querySelector('hr').style.display = 'none';
    }
    table.querySelectorAll('div')[table.querySelectorAll('div').length - 1].style.display = 'none';
}
//给收费按钮添加点击事件
for(var i = 0; i < customers.children.length; i++){
    customers.children[i].querySelectorAll('div')[customers.children[i].querySelectorAll('div').length - 1].addEventListener('click',function() {
        if(this.className == 'charge'){
            var temp = Number(this.getAttribute('data-money'));
            var finishEat = document.querySelector('.finishEat');
            // console.log(this.parentNode.className.substring(13,22));
            finishEat.querySelector('p').innerHTML = this.parentNode.className.substring(13,22) + finishEat.querySelector('p').innerHTML.substring(9,20) + temp;
            finishEat.style.display = 'block';
            setTimeout(function() {
                finishEat.style.display = 'none';
            },3000);
            allMoney += temp;
            inittable(this.parentNode);
        }
        if(this.className == 'explain'){
            var left = document.querySelector('.left');
            left.querySelector('p').innerHTML = this.parentNode.className.substring(13,22) + left.querySelector('p').innerHTML.substring(9);
            left.style.display = 'block';
            setTimeout(function() {
                left.style.display = 'none';
            },3000);
            inittable(this.parentNode);
        }
    })
}

//实时做菜监控
function cookmonitor(){
    //循环四张桌子
    for(var i = 0; i < 4; i++){
        //循环三个菜
        for(var j = 0; j < 3; j++){
            if(emptytables[i].querySelectorAll('.foodname')[j].getAttribute('data-isCooking') == 'false'){
                emptytables[i].querySelectorAll('.foodname')[j].querySelector('.name').innerHTML;
                // console.log(emptytables[i].querySelectorAll('.foodname')[j].querySelector('.name').innerHTML);
                for(var k = 0; k <chefs.length; k++){
                    //找到休息的厨师
                    if(chefs[k].cookEle.className == 'charatericon restcook'){
                        //修改菜品状态，改为正在做
                        emptytables[i].querySelectorAll('.foodname')[j].setAttribute('data-isCooking','true');
                        //改变厨师的背景颜色
                        chefs[k].cookEle.className = 'charatericon workingcook';
                        //改变菜名
                        chefs[k].cookEle.querySelector('.cookingdish').querySelector('.name').innerHTML = emptytables[i].querySelectorAll('.foodname')[j].querySelector('.name').innerHTML;
                        //修改进度条颜色
                        chefs[k].cookEle.querySelector('.cookingdish').querySelector('.color').className = chefs[k].cookEle.querySelector('.cookingdish').querySelector('.color').className.substring(0,5) + " darkorange";
                        //做菜并在做完将厨师变为完成状态
                        cookedtofinish(chefs[k]);
                        break;
                    }
                }
            }
        }
    }
}
setInterval(cookmonitor,1000);

//实时上菜监控
function servemonitor(){
    //遍历厨师
    for(var k = 0; k < chefs.length; k++){
        //查找是否有已完成菜品
        if(chefs[k].cookEle.className == 'charatericon finishcook'){
            //遍历桌子，查找需要这个菜品的顾客
            for(var i = 0; i < 4; i++){
                //遍历该桌的菜品
                for(var j = 0; j < 3; j++){
                    //还没过期 并且 没有完成
                    if(customers.children[i].querySelectorAll('.foodname')[j].getAttribute('data-isExpire') == '0' && customers.children[i].querySelectorAll('.foodname')[j].getAttribute('data-isFinish') == '0'){
                        //如果该菜与完成的厨师是同一道菜 并且厨师是完成状态
                        if(chefs[k].cookEle.querySelector('.cookingdish').querySelector('.name').innerHTML == customers.children[i].querySelectorAll('.foodname')[j].querySelector('.name').innerHTML){
                            customers.children[i].querySelectorAll('.servefood')[j].style.display = 'block';
                        }
                    }
                }
            }
        }
    }
}
setInterval(servemonitor,1000);

function chargemonitor(){
     for(var i = 0; i < 4; i++){
        var chargemoney = 0;
        //确定不是空桌子
        if(customers.children[i].className != 'charatericon emptytable'){
            //该桌客人全部菜都超时了
            if(customers.children[i].getAttribute('data-isAllExpire') == 'true'){
                customers.children[i].className = customers.children[i].className.substring(0,22) + " waitingexplain";
                customers.children[i].querySelectorAll('div')[customers.children[i].querySelectorAll('div').length - 1].className = 'explain';
                customers.children[i].querySelectorAll('div')[customers.children[i].querySelectorAll('div').length - 1].style.display = 'block';
                break;
            }
            //该桌可以走了
            if(customers.children[i].getAttribute('data-isGo') == '1'){
                //结账
                for(var j = 0; j < 3; j++){
                    //已选菜 并且完成了
                    if(customers.children[i].querySelectorAll('.foodname')[j].getAttribute('data-isChoose') == '1' && customers.children[i].querySelectorAll('.foodname')[j].getAttribute('data-isFinish') == '1'){
                        for(var k = 0; k < 9; k++){
                            //在菜单中找到价格
                            if(customers.children[i].querySelectorAll('.foodname')[j].querySelector('.name').innerHTML == dishes[k].name){
                                chargemoney += dishes[k].money;
                                break;
                            }
                        }
                    }
                }
                if(customers.children[i].querySelectorAll('div')[customers.children[i].querySelectorAll('div').length - 1].className == 'charge'){
                    customers.children[i].querySelector('.charge').setAttribute('data-money',chargemoney);
                    customers.children[i].className = customers.children[i].className.substring(0,22) + " waitingcharge";
                    customers.children[i].querySelectorAll('div')[customers.children[i].querySelectorAll('div').length - 1].className = 'charge';
                    customers.children[i].querySelectorAll('div')[customers.children[i].querySelectorAll('div').length - 1].style.display = 'block';
                }

            }
        }

     }
}