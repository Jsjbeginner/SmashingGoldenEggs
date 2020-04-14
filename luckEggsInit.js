var lock_egg = false;//锁
var luckEggActivityId;//彩蛋惊喜专区id

var luckEggAcStart;//翻牌开始时间
var luckEggAcEnd;//翻开结束时间
var eggt;//用于记录pvuv接口
function luckEggsInit($t){
	eggt = $t.attr("id");
	if(!areaAcIdList[eggt]) return;
	luckEggActivityId = areaAcIdList[eggt];//专区活动id
	getAcCommonById(areaAcIdList[eggt], function (activityInfo) {
		var activityDesc = activityInfo.activity_desc;
        areaAcRuleList[eggt] = activityDesc;//活动规则
        var startTimeStr = activityInfo.start_time;//开始时间
        var endTimeStr = activityInfo.end_time;//结束时间
        if (nowT < startTimeStr) {
        	luckEggAcStart = activityInfo.start_time_f;
        }
        if (nowT > endTimeStr) {
        	luckEggAcEnd = activityInfo.start_time_f;
        }
        qryEggsCard();//查询砸金蛋次数以及方式
    },$t);
}
/**
 * 查询砸金蛋次数以及方式
 */
var prizeTimeLuckEggs = '0';
var maxNumLuckEggs = '0';
var realIntegrateLuckEggs;
var deductDreamLuckEggs = false;
var integrateHQLuckEggs;
var deductHQLuckEggs = false;
var cashNumEggs;
function qryEggsCard() {
    var req = {
        "activityId": luckEggActivityId,
        "phoneNumber": serviceId,
        "encryptStr": serviceIdStr,
        "dreamScoreFlag" : "1",
    };
    $.ajaxReq("concent", "/contactcentre/memberDay/queryIfPrizeDraw", req, function (resp) {
        if (resp.code == "0000" && resp.rows.length > 0) {
        	prizeTimeLuckEggs = '0';
        	maxNumLuckEggs = '10';
//        	prizeTimeLuckEggs = resp.rows[0].number || '0';//免费砸蛋次数
//        	maxNumLuckEggs = resp.rows[0].maxNum || '0';//时间段内最大砸蛋次数
            realIntegrateLuckEggs = resp.realIntegrate;//梦享值
            deductDreamLuckEggs = resp.deductDream;//砸蛋一次扣减的梦享值
            integrateHQLuckEggs = resp.integrateHQ;//积分
            deductHQLuckEggs = resp.deductHQ;//砸蛋一次扣减的积分
            cashNumEggs = resp.cashNumEggs || '10000';//缴费金额     
        } else if (resp.code == "666") {
            alert("该手机号已被修改");
        } else {
        	prizeTimeLuckEggs = "0";
        	maxNumLuckEggs = "0";
        	realIntegrateLuckEggs = "";
        	deductDreamLuckEggs = "";
        	integrateHQLuckEggs = false;
        	deductHQLuckEggs = false;
        	cashNumEggs = "";
        }
        selectEggsStyle();
    }, false, true, 0);
}
/**
 * 设置当前金蛋样式
 */
function selectEggsStyle(){
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
	eggStr += '<div class="integralInfo">';
	eggStr += '	<div class="item item-two">'
	eggStr += '  		<span class="item-hq">'
	eggStr += '			<span class="title">号码:</span>';
	eggStr += '			<span class="serviceId">'+ serviceId +'</span>';
	eggStr += '  		</span>'
	eggStr += '  		<span class="item-dream">'
	eggStr += '			<span class="title">砸蛋次数:</span>';
	eggStr += '			<span class="maxNumLuckEggs">'+ maxNumLuckEggs +'</span>';
	eggStr += '  		</span>'
	eggStr += '	 </div>';
//	eggStr += '	<div class="item item-two">'
//	eggStr += '  		<span class="item-hq">'
//	eggStr += '			<span class="title">我的积分:</span>';
//	eggStr += '			<span class="integrateHQ">'+ integrateHQLuckEggs +'</span>';
//	eggStr += '			<span class="title">分</span>';
//	eggStr += '  		</span>'
//	eggStr += '  		<span class="item-dream">'
//	eggStr += '			<span class="title">我的梦想值:</span>';
//	eggStr += '			<span class="realIntegrate">'+ realIntegrateLuckEggs +'</span>';
//	eggStr += '  		</span>'
//	eggStr += '	 </div>';
	eggStr += '	 </div>';
	eggStr += '<div class="drawModalOpt">';
	eggStr += '		<div class="opt-left">';
	eggStr += '			<img src="img/egg_rule_btn.png" onclick="lookRule(\''+ t +'\')"" />';
	eggStr += '		</div>';
	eggStr += '		<div class="opt-right">';
	eggStr += '			<img src="img/egg_data_btn.png" onclick="myEggsDialogShow(\'#cardHisDialog\')" />';
	eggStr += '		</div>';
	eggStr += '</div>';
	$("#"+ eggt).find(".modal-con").html(eggStr);
}
/**
 * 金蛋点击事件
 * @param eggIndex 点击第几个金蛋 
 */
var lock_eggs = false;//锁
function goLuckEggs(eggIndex){
	if(lock_eggs) return;
	if(maxNumLuckEggs == '0'){//已经达到上线
		alert("您今日次数已使用完毕，请明天再来参与");
		lock_eggs = false;
		return;
	} else if(maxNumLuckEggs >0 && prizeTimeLuckEggs == '0'){//弹出选择框，让其选择参与方式
		var btns = [];
    	var btnsTs = [];
    	var btnsFunc = [];
    	if(cashNumEggs){
			btns.push("缴费");
			btnsTs.push("缴费" + cashNumEggs + "元再抽奖一次");
			btnsFunc.push(function(){
				choujiangLuckEggs(eggIndex,'5');
			});
		}
		if( (integrateHQLuckEggs || integrateHQLuckEggs == 0) && deductHQLuckEggs && integrateHQLuckEggs >= deductHQLuckEggs){
			btns.push("扣积分");
			btnsTs.push("扣减" + deductHQLuckEggs + "积分抽奖一次");
			btnsFunc.push(function(){
				choujiangLuckEggs(eggIndex,'1');
			});
		}
		if((realIntegrateLuckEggs || realIntegrateLuckEggs == 0) && deductDreamLuckEggs && realIntegrateLuckEggs >= deductDreamLuckEggs){
			btns.push("扣梦享值");
			btnsTs.push("扣减" + deductDreamLuckEggs + "梦享值兑换");
			btnsFunc.push(function(){
				choujiangLuckEggs(eggIndex,'2');
			});
		}
		if(btns.length > 0){
			var text = "";
			for(var i = 0 ; i < 3 ; i ++){
				try{
					if(btnsFunc[i]){
						if(i == 0){
	    					text += btnsTs[i];
	    				}else{
	    					text += "或" + btnsTs[i];
	    				}
					}
				}catch(e){
					btnsFunc.push(false);
				}
			}
			if(btns.length == 1) btns = false;
			confirmNew(text, btnsFunc[0], btnsFunc[1], false, btns , btnsFunc[2]);
		}
	} else if(maxNumLuckEggs >0 && prizeTimeLuckEggs > 0){//免费抽奖
		choujiangLuckEggs(eggIndex,'');
	}
}
/**
 * 砸金蛋抽奖接口
 * @param dreamScore 类型：1-积分，2-梦享值，5-缴费，空-免费抽奖。eggIndex砸第几个
 */
function choujiangLuckEggs(eggIndex, dreamScore) {
	lock_eggs = true;//选择抽奖方式之后 上锁
	if (openid == "" || openid == null || openid == undefined) {
        alert("openid不能为空！");
        lock_eggs = false;
        return;
    }
	if (!beMustLogin()) {
		lock_eggs = false;
        return;
    }
    if (subscribeOpenid == "0") {//0未关注
        $(".nbDiv2").show();
        openDialog222(".gzModal");
        lock_eggs = false;
        return;
    } else {// 1关注
    	if (bindOpenid == "0") {//0未绑定
            var cburl = encodeURIComponent(window.location.href);
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf71dfa4539d2f215&redirect_uri=http%3A%2F%2Fwkfw.unisk.cn%2Fopenwx%2Fgame%2Fbinding%2Fjxbinding1&response_type=code&scope=snsapi_base&state=' + cburl + '&component_appid=wx9ca145ee3ab86a74#wechat_redirect';
        }
    }
    if(!checkAcTime(".luckEggsC")){//用于专区受限时的校验
    	lock_eggs = false;
    	return false;
    }
    if (luckEggAcStart) {//用于专区不受限时的校验
        var year1 = luckEggAcStart.substr(0, 4);//当前年
        var month1 = luckEggAcStart.substr(5, 2);//当前月
        var day1 = luckEggAcStart.substr(8, 2);//当前月
        alert("【18客户日，比想更美】" + year1 + "." + month1 + "." + day1 + "客户日未开始，本月18日让我们不见不散哦！");
        lock_eggs = false;
        return;
    }
    if (luckEggAcEnd) {
        var year1 = luckEggAcEnd.substr(0, 4);//当前年
        var month1 = luckEggAcEnd.substr(5, 2);//当前月
        var day1 = luckEggAcEnd.substr(8, 2);//当前月
        var nextYear = year1;
        var nextMonth = parseInt(month1) + 1;
        if (nextMonth > 12) {
            nextYear = parseInt(nextYear) + 1;
            nextMonth = ("0" + (nextMonth - 12)).substr(-2);
        }
        alert("【18客户日，比想更美】" + year1 + "." + month1 + "." + day1 + "客户日已结束，" + nextYear + "." + nextMonth + "." + day1 + "让我们不见不散哦！");
        lock_eggs = false;
        return;
    }
    var areaId = eggt.split("_")[1];
    addMemberdayPVUVStatistic(activityId, areaId, luckEggActivityId, serviceId, "102", "", "3");//pvuv
    if(dreamScore == '5'){//选择了缴费的方式
    	var payFeeLink = bUrl + "/pages/contactCentrePhone/cashierDesk/payFee.html?awardFlag=3&activityFlag=" + luckEggActivityId;//活动标识
		payFeeLink += "&serviceId=" + serviceId + "&paymentFee=" + cashNumEggs + "&memberAct=1";
		window.location.href = payFeeLink;
    	lock_eggs = false;
    	return;
    }
    var req = {
        "activityId": luckEggActivityId,
        "phoneNumber": serviceId,
        "encryptStr": serviceIdStr,
        "openId": openid,
        "dreamScore": dreamScore,
    };
    $.ajaxReq("concent", "/contactcentre/memberDay/prizeDraw", req, function (resp) {
        if (resp.code == "666") {
        	lock_eggs = false;
            alert("该手机号已被修改");
        } else if (resp.code == "0000") {
        	var rowsBigTurnTable = resp.rowsBigTurnTable;//发送短信 入参
        	var prizeId = resp.rows.prizeId;
        	var preaId = resp.rows.preaId;
        	var behindImg = resp.rows.behindImg;//现金红包图片
        	var desc = resp.rows.prizeReminder;//中奖的提示信息
        	var typeCode = resp.rows.typeCode || "";//1001:国内流量(语音)包,1002:总部权益中心权益,1011:省份权权益,1014:话费现金券
        	if(typeCode == '1016'){
        		var reqw = {
        			"phoneNumber": serviceId,
    		        "openId": openid,
    			}
    			$.ajaxReq("concent", "/contactcentre/memberDay/cashPize/cashPartnerCheck", reqw, function (resp) {//是否是梦享合伙人 
    				if(resp.code == "0000"){
    					if(resp.isPartner == "0"){//1是0否
    						$("#agreement").attr("checked",true)
    						$("#moneySend").find(".dialog-body .agree").css("display", "flex");
    					}
    					$("#moneySend").find(".dialog-body .numImg .imgbg").attr("src", behindImg);
    					$("#moneySend").find(".dialog-body .numTxt .txt1 .num").html(desc);
    					$("#moneySend").find(".dialog-body .button").attr("isPartner" , resp.isPartner);
    					$("#moneySend").find(".dialog-body .button").attr("prizeId" , prizeId);
    					$("#moneySend").find(".dialog-body .button").attr("preaId" , preaId);
    					setAnimationEggs(eggIndex, dreamScore,'1');
    				} else {
    					alert("查询是否是梦享合伙人错误")
    				}
    			})
        	} else {
				$("#prizeDialogEggs").find(".dialog-body .numTxt .txt1 .num").html(desc);
				$("#eggs-money").html(cashNumEggs);
				$("#now-date").html(nowJ);
        		setAnimationEggs(eggIndex, dreamScore,'2',rowsBigTurnTable,preaId,typeCode);
        	}
        } else {
        	lock_eggs = false;
            alert("翻牌失败了,请小主稍后再试哦~");
        }
    });
}
/**
 * 设置金蛋动画
 * flag:1- 现金红包，2其他权益
 */
function setAnimationEggs(eggIndex, dreamScore,flag,rowsBigTurnTable,preaId,typeCode){
	$("#egg_" + eggIndex).children(".hammer").addClass('hammerClick');//显示锤子-1s动画
	$("#egg_" + eggIndex).children(".txt").hide();//隐藏提示语句
	setTimeout(function (){
		$("#egg_" + eggIndex).children(".hammer").removeClass('hammerClick');//隐藏锤子
		$("#egg_" + eggIndex).children(".content").children(".front").hide();//隐藏金蛋
		$("#egg_" + eggIndex).children(".content").children(".behind").show();//显示被砸开样子-1s动画
		$("#egg_" + eggIndex).children(".ray").show();//显示灯光-1s动画
		setTimeout(function (){
			$("#egg_" + eggIndex).children(".ray").hide();//隐藏灯光
			$("#egg_" + eggIndex).children(".content").children(".behind").children(".behind_bgt").addClass('behind_bgt_animation');//小沃弹出来-1s动画
			setTimeout(function (){
				lock_eggs = false;
				if(flag == '1'){
					dialogShow("#moneySend");//弹出新进红包
				} else {
					var b = sendRights(preaId, typeCode, 0);//权益
					if (!b) {
	                    return;
	                }
					$.ajaxReq("concent", "/contactcentre/memberDay/bigTurntableSendMessage", rowsBigTurnTable , function (rep) {});
					dialogShow("#prizeDialogEggs");
				}
				qryEggsCard();//重新查询用户信息-重置砸金蛋样式
			}, 1000)
		}, 1000)
	}, 1000);
};
/**
 * 跳转缴费
 */
function goPay(){
	lock_eggs = false;
	var payFeeLink = bUrl + "/pages/contactCentrePhone/cashierDesk/payFee.html?awardFlag=3&activityFlag=" + luckEggActivityId;//活动标识
	payFeeLink += "&serviceId=" + serviceId + "&paymentFee=" + cashNumEggs + "&memberAct=1";
	window.location.href = payFeeLink;
}
/**
 * 我的奖品弹框
 */
var linkInfoListLuckEggs = {};
function myEggsDialogShow(v, re){
	if (!re) {
        if (!beMustLogin()) {
            return;
        }
    }
	qryMyPrizeList(function (info) {//查询我的中奖列表
        if (!info) {
            return;
        }
        var str = '';
        for (var i = 0; i < info.length; i++) {
            var preaId = info[i].preaId;
            var prizeName = info[i].prizeName;
            var prizeTime = info[i].prizeTime;
            var prizeTypeCode = info[i].prizeTypeCode;//1001语音流量包,1002总部权益包,1003腾讯网卡,1004免费送宽带,1005第三方链接奖励,1006实物奖励,1007虚拟奖品
            var prizeCode = info[i].prizeCode;//领奖链接
            var linkInfo = info[i].linkInfo;//实物领取信息
            var ifReceive = info[i].ifReceive;//是否领取   0否,1是
            var ifSuccess = info[i].ifSuccess;//是否发放成功 0否,1是
            var buttonUrl = info[i].prize_button_url || "";//权益配置的链接
            var opt = "";
            var optText = "";
            if (prizeTypeCode == "1001" || prizeTypeCode == "1002" || prizeTypeCode == "1011" || prizeTypeCode == "1014") {//权益奖品
                if (ifReceive == "0" || ifReceive == "") {
                    opt = "may";
                    optText = "领取";
                }
                if (ifReceive == "1") {
                    if (ifSuccess == "0") {
                        optText = "领取失败";
                    }
                    if (ifSuccess == "1") {//权益已经自动发放
                    	if(buttonUrl) {
                    		 optText = "使用";
                    	} else {
                    		 optText = "已领";
                    	}
                    }
                }
            }
            if (prizeTypeCode == "1003" || prizeTypeCode == "1004" || prizeTypeCode == "1005" || prizeTypeCode == "1006") {
                opt = "may";
                optText = "领取";
            }
            if (prizeTypeCode == "1006" && linkInfo) {
                optText = "修改";
                linkInfoListLuckEggs[preaId] = linkInfo;
            }
            if(buttonUrl){
            	str += '<tr><td>' + prizeName + '</td><td>' + prizeTime + '</td><td><span class="' + opt + '" onclick="goUserLuckCard(\'' + buttonUrl + '\')">' + optText + '</span></td></tr>';
            } else {
            	str += '<tr><td>' + prizeName + '</td><td>' + prizeTime + '</td><td><span class="' + opt + '" onclick="getMyPrizeLuckEggs(\'' + v + '\' , \'' + preaId + '\' , \'' + prizeTypeCode + '\' , \'' + prizeCode + '\' , this' + ',\'' + optText + '\','+ buttonUrl +'\')">' + optText + '</span></td></tr>';
            }
          }
        $("#cardHis").html(str);
        $(".nbDiv2").show();
    	$("#cardHisDialog").show();
    }, serviceId, luckEggActivityId);
}
/**
 * 领取我的奖品
 */
function getMyPrizeLuckEggs(ov, preaId, prizeTypeCode, prizeCode, t, optText) {
    if (t && !$(t).hasClass("may")) return;
    if (prizeTypeCode == "1001" || prizeTypeCode == "1002" || prizeTypeCode == "1011" || prizeTypeCode == "1014") {
    	var b = sendRights(preaId, prizeTypeCode);
        if (!b) {
            //alert("报告小主：您的号码无法叠加该产品，详见活动规则，赶紧参加其他活动吧！");
            return;
        } else {
            dialogAlert("小主您的奖品已领取成功,请等待系统发放~");
        }
        myEggsDialogShow(false, 1);
    } else if (prizeTypeCode == "1003") {//腾讯王卡
        window.location.href = window.location.protocol + "//" + window.location.host + "/concent/pages/contactCentrePhone/broadband/choosePackage.html?newSetupId=2";
    } else if (prizeTypeCode == "1004") {//免费宽带
        window.location.href = window.location.protocol + "//" + window.location.host + "/concent/pages/contactCentrePhone/broadband/choosePackage.html?newSetupId=3";
    } else if (prizeTypeCode == "1005") {//第三方链接奖励
        window.location.href = prizeCode;
    } else if (prizeTypeCode == "1006") {//实物奖励
        var linkInfo = linkInfoListLuckEggs[preaId];
//        if (linkInfo) {
//            linkInfo = linkInfo.split("，");
//            $("#sendPrizeDialog .uName").val(linkInfo[0].split("：")[1]);
//            $("#sendPrizeDialog .uPhone2").val(linkInfo[1].split("：")[1]);
//            $("#sendPrizeDialog .uAddr").val(linkInfo[2].split("：")[1]);
//        } else {
//            $("#sendPrizeDialog .uName").val("");
//            $("#sendPrizeDialog .uPhone2").val("");
//            $("#sendPrizeDialog .uAddr").val("");
//        }
//        var v = $("#sendPrizeDialog");
//        dialogHide(ov);
//        dialogShow(v);
//        sendPrize(v, preaId);//领取奖品
    }
}
/**
 * 已发放的权益展示去使用
 */
function goUserLuckCard(buttonUrl){
	window.location.href = buttonUrl;
}
