var phoneNumber;
$(function(){
//	$("html,body").css("height" , $(window).height());
//	$("html,body").css("width" , window.screen.width);
	phoneNumber = localStorage.getItem('phoneNumber') || '1*********0';
	queryEggsNum();//查询砸金蛋次数以及方式
});
var freeNum = '0';//免费次数
var maxNum = '0';//最大次数
function queryEggsNum(){
//	$("html,body").css("height" , $(window).height());
//	$("html,body").css("width" , $(window).width());
	setTimeout(function(){//模拟ajax请求
		freeNum = '2';
		maxNum = '4';
		setEggsStyle();
	},1000)
}
function setEggsStyle(){
	var eggsInfo = [
		{
			"frontImg": "img/egg_front1_bg.png",//金蛋正面图片
			"frontImgBottom": "img/egg_front1_bottom.png",//金蛋正面底座
			"frontImgTxt": "img/egg_front1_txt.png",//金蛋正面文本提示
		},{
			"frontImg": "img/egg_front2_bg.png",//金蛋正面图片
			"frontImgBottom": "img/egg_front2_bottom.png",//金蛋正面底座
			"frontImgTxt": "img/egg_front2_txt.png",//金蛋正面文本提示
		},{
			"frontImg": "img/egg_front3_bg.png",//金蛋正面图片
			"frontImgBottom": "img/egg_front3_bottom.png",//金蛋正面底座
			"frontImgTxt": "img/egg_front3_txt.png",//金蛋正面文本提示
		}
	]
	var eggStr = "";
	eggStr += '<div class="luckEggsC">';
	eggsInfo.forEach((item,index)=>{
		eggStr += '<div class="item egg_'+ Number(index+1) +'" id="egg_'+ Number(index+1) +'">';
		eggStr += '<div class="txt"><img src="'+ item.frontImgTxt +'"></div>';
		eggStr += '	<div class="content">';
		eggStr += '		<div class="front" onclick="goLuckEggs('+ Number(index+1) +')">';
		eggStr += '			<img src="'+ item.frontImg +'">';
		eggStr += '		</div>';
		eggStr += '		<div class="behind">';
		eggStr += '			<img class="behind_bg" src="img/egg_behind_bg.png">';
		eggStr += '			<img class="behind_bgt" src="img/egg_xiaowo.png">';
		eggStr += '		</div>';
		eggStr += '	</div>';
		eggStr += '	<img class="ray" src="img/egg_ray.png" style="width: '+ $(window).width() +'px;bottom: -'+ ($(window).width() / 2 - 40) +'px;">';
		eggStr += '	<div class="hammer">';
		eggStr += '		<img class="hammer_img" src="img/egg_hammer.png">';
		eggStr += '	</div>';
		eggStr += '<div class="bottom"><img src="'+ item.frontImgBottom +'"></div>';
		eggStr += '</div>';
	})
	eggStr += '</div>';
	eggStr += '</div>';
	eggStr += '<div class="info">';
	eggStr += '		<div class="item">'
	eggStr += '			<span class="title">号码:</span>';
	eggStr += '			<span class="phoneNumber">'+ phoneNumber +'</span>';
	eggStr += '		</div>';
	eggStr += '		<div class="item">'
	eggStr += '			<span class="title">最大砸蛋次数:</span>';
	eggStr += '			<span class="phoneNumber">'+ maxNum +'</span>';
	eggStr += '		</div>';
	eggStr += '	 </div>';
	eggStr += '	 </div>';
	eggStr += '<div class="button">';
	eggStr += '		<div class="opt">';
	eggStr += '			<img src="img/egg_rule_btn.png" onclick="lookRule()"/>';
	eggStr += '		</div>';
	eggStr += '		<div class="opt">';
	eggStr += '			<img src="img/egg_data_btn.png" onclick="" />';
	eggStr += '		</div>';
	eggStr += '</div>';
	$("#eggs").html(eggStr);
}
var lock_eggs = false;//锁
function goLuckEggs(eggIndex){
	if(lock_eggs) return;
	if(maxNum == '0'){//已经达到上线
		alert("您今日次数已使用完毕，请明天再来参与");
		lock_eggs = false;
		return;
	} else if(maxNum >0 && freeNum == '0'){//弹出选择框，让其选择参与方式
		alert("请充值以便继续进行抽奖")
	} else if(maxNum >0 && freeNum > 0){//可抽奖且免费抽奖
		setAnimationEggs(eggIndex);
	}
}
function setAnimationEggs(eggIndex){
	$("#egg_" + eggIndex).children(".hammer").addClass('hammerClick');//显示锤子-1s动画
	$("#egg_" + eggIndex).children(".txt").hide();//隐藏提示语句
	timeOut(function (){
		$("#egg_" + eggIndex).children(".hammer").removeClass('hammerClick');//隐藏锤子
		$("#egg_" + eggIndex).children(".content").children(".front").hide();//隐藏金蛋
		$("#egg_" + eggIndex).children(".content").children(".behind").show();//显示被砸开样子-1s动画
		$("#egg_" + eggIndex).children(".ray").show();//显示灯光-1s动画
	}, 1000).then(() => {
		return timeOut(function (){
			$("#egg_" + eggIndex).children(".ray").hide();//隐藏灯光
			$("#egg_" + eggIndex).children(".content").children(".behind").children(".behind_bgt").addClass('behind_bgt_animation');//小沃弹出来-1s动画
		},1000)
	}).then(()=>{
		timeOut(function (){
			lock_eggs = false;
			alert("恭喜您获得XXX，请在我的奖品查看");
			freeNum --;
			maxNum --;
			setEggsStyle();//重新查询用户信息-重置砸金蛋样式
		},1000)
	})
};
/**
 * 定义公用的setTimeout函数
 */
function  timeOut(cb, timer){
	return new Promise((resolve) => {
		let a = setTimeout(() => {
			cb && cb()
			clearTimeout(a)
			resolve()
		}, timer || 0)
	})
}
function lookRule(){
	var rule = "活动规则\n1、a\n2、b";
	$("#acRuleDialog" + " .dialog-body").html(rule.replace(/\n/g , "<br />"));
	$("#acRuleDialog").show();
}
function dialogHide(v){
	$(v).hide();
}