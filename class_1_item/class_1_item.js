var class_1_menu =  [
        {name:'精选男装', sub:[{name:'男士上装'},{name:'男士下装'},{name:'运动套装'}]},
        {name:'精选女装', sub:[{name:'女士裙装'},{name:'女士上衣'},{name:'女士下装'},{name:'运动套装'},{name:'特色品类'}]},
        {name:'婴儿童装', sub:[{name:'精选童装'},{name:'儿童运动'},{name:'内衣配件'}]},
        {name:'文胸塑身', sub:[{name:'文胸'},{name:'男士内裤'},{name:'女士内裤'},{name:'塑身衣'},{name:'休闲棉袜'},{name:'连裤袜/丝袜'},{name:'睡衣/家居服'}]},
        {name:'配饰腕表', sub:[{name:'珠宝'},{name:'饰品'},{name:'围巾'},{name:'腰带'},{name:'手套'},{name:'眼镜'},{name:'手表'},{name:'手表配件'},{name:'皮带配件'}]},
        {name:'保暖基础', sub:[{name:'保暖内衣'},{name:'保暖套装'}]}
];

var class_2_menu =  [
        {name:'全球名酒', sub:[{name:'白酒'},{name:'葡萄酒'},{name:'洋酒'},{name:'黄酒/养生酒'},{name:'收藏酒/陈年老酒'},{name:'礼盒装'}]},
        {name:'休闲零食', sub:[{name:'坚果炒货'},{name:'饼干'},{name:'糕点'},{name:'膨化食品'},{name:'肉类即食'},{name:'糖果巧克力'},{name:'蜜饯/果干'},{name:'海味即食'},{name:'奶酪乳品'},{name:'核桃'}]},
        {name:'乳品冲饮', sub:[{name:'乳制品'},{name:'茗茶'},{name:'饮料'},{name:'冲饮'},{name:'咖啡'},{name:'饮用水'}]},
        {name:'调味制品', sub:[{name:'鸡精'},{name:'酱油'},{name:'咖喱'},{name:'食糖'},{name:'火锅汤/料'},{name:'香油/芝麻油'},{name:'醋制品'},{name:'酱类'}]},
        {name:'粮油干货', sub:[{name:'主食'},{name:'粗粮'},{name:'食用油'},{name:'腊味'},{name:'方便食品'},{name:'烘焙原料'},{name:'干货'}]},
        {name:'滋补保健', sub:[{name:'养生滋补'},{name:'蜂类产品'},{name:'参类滋补品'},{name:'滋补食材'},{name:'新资源保健'},{name:'参茸贵细'},{name:'药食同源'}]}
];
var class_3_menu =  [
        {name:'新鲜水果', sub:[{name:'时令水果'},{name:'热带水果'},{name:'热门水果'},{name:'水果礼盒'}]},
        {name:'海鲜水产', sub:[{name:'海产干货'},{name:'虾类'},{name:'蟹类'},{name:'鱼类'},{name:'贝类'},{name:'其他'}]},
        {name:'猪牛羊肉', sub:[{name:'牛肉'},{name:'羊肉'},{name:'猪肉'},{name:'火锅食材'},{name:'冷鲜肉'}]},
        {name:'禽类蛋品', sub:[{name:'鸡肉'},{name:'鸭肉'},{name:'鸭蛋/咸鸭蛋'},{name:'鸡蛋'},{name:'喜蛋'}]},
        {name:'速冻食品', sub:[{name:'水饺/混沌'},{name:'面类'},{name:'黄油奶酪'},{name:'火锅丸串'},{name:'包类'},{name:'披萨'}]},
        {name:'冷品饮品', sub:[{name:'冷冻甜品/蛋糕'},{name:'冰激凌'},{name:'冷藏蔬果汁'},{name:'低温奶'}]}
];

var class_4_menu =  [
        {name:'厨房电器', sub:[{name:'冰箱'},{name:'烟机/灶'},{name:'冷柜/冰'},{name:'消毒柜'},{name:'热水器'},{name:'微波炉'},{name:'电水壶'},{name:'豆浆机'},{name:'电饭煲'},{name:'电磁炉'},{name:'料理机'}]},
        {name:'家居电器', sub:[{name:'电视'},{name:'音响/DVD'},{name:'空调'},{name:'洗衣机'},{name:'家庭影院'},{name:'电风扇'},{name:'扫地机'}]},
        {name:'办公设备', sub:[{name:'投影机'},{name:'打印机'},{name:'行政财会设备'}]},
        {name:'摄影数码', sub:[{name:'专业单反'},{name:'微单相机'},{name:'运动数码'},{name:'摄像机'},{name:'拍立得'},{name:'时尚数码'},{name:'摄影配件'}]},
        {name:'智能设备', sub:[{name:'智能摄像头'},{name:'智能净化器'},{name:'智能净水器'},{name:'智能水杯'},{name:'智能手表'},{name:'智能手环'},{name:'运动追踪器'},{name:'VR眼镜'}]},
        {name:'手机电脑', sub:[{name:'电脑整机'},{name:'外设产品'},{name:'网络设备'},{name:'电脑配件'},{name:'手机通讯'},{name:'手机配件'}]}
];
var class_5_menu =  [
        {name:'时尚女鞋', sub:[{name:'女靴'},{name:'休闲鞋'},{name:'高跟鞋'},{name:'平底鞋'},{name:'家居拖鞋'},{name:'帆布鞋'},{name:'单鞋'},{name:'凉鞋'}]},
        {name:'流行男鞋', sub:[{name:'男靴'},{name:'商务鞋'},{name:'休闲鞋'},{name:'板鞋'},{name:'帆布鞋'},{name:'家居拖鞋'},{name:'凉鞋/沙滩鞋'}]},
        {name:'婴用童鞋', sub:[{name:'婴儿鞋'},{name:'学步鞋'},{name:'童鞋'}]},
        {name:'潮流女包', sub:[{name:'单肩包'},{name:'钱包/卡包'},{name:'手拿包'},{name:'手提包'},{name:'双肩包'},{name:'斜挎包'}]},
        {name:'精品男包', sub:[{name:'斜挎包'},{name:'钱包/卡包'},{name:'商务手提包'},{name:'皮带/礼盒'},{name:'手包'}]},
        {name:'功能箱包', sub:[{name:'登山包'},{name:'学生包'},{name:'休闲运动包'},{name:'电脑包'},{name:'数码/摄影包'},{name:'登机箱'},{name:'旅行包'},{name:'拖运箱'},{name:'旅行配件'}]}
];
var class_6_menu =  [
        {name:'厨房烹饪', sub:[{name:'烹饪锅具'},{name:'刀剪砧板'},{name:'保鲜收纳'},{name:'厨房小件'},{name:'精美餐具'}]},
        {name:'精美家纺', sub:[{name:'床品套件'},{name:'被子'},{name:'枕头'},{name:'毛巾/浴巾'},{name:'床垫/床褥'},{name:'毛巾被/毯'},{name:'坐垫/抱枕'},{name:'地毯'},{name:'地垫'},{name:'餐桌'},{name:'布艺'},{name:'窗帘/窗纱'}]},
        {name:'家具用品', sub:[{name:'沙发床'},{name:'床垫'},{name:'电视柜'},{name:'电脑桌'},{name:'衣柜鞋柜'},{name:'茶几'},{name:'书桌'},{name:'餐桌'},{name:'客厅家具'},{name:'餐厅家具'},{name:'卧室家具'},{name:'书房家具'},{name:'门厅家具'},{name:'置物架'}]},
        {name:'生活日用', sub:[{name:'缝纫用品'},{name:'收纳用品'},{name:'洗晒用品'},{name:'浴室用品'},{name:'净化除味'},{name:'雨伞'},{name:'雨具'},{name:'衣橱'},{name:'衣架'}]},
        {name:'灯饰软装', sub:[{name:'LED灯'},{name:'吊灯'},{name:'节能灯'},{name:'台灯'},{name:'吸顶灯'},{name:'应急/手电'}]},
        {name:'清洁洗护', sub:[{name:'衣物洗护'},{name:'洗衣液'},{name:'洗衣粉/皂'},{name:'家庭清洁'},{name:'洗洁精'},{name:'洁厕剂'},{name:'消毒液'},{name:'清洁工具'},{name:'一次性用品'}]}
];

var class_7_menu =  [
        {name:'面部护肤', sub:[{name:'洁面'},{name:'化妆水'},{name:'乳液'},{name:'面霜'},{name:'防晒'},{name:'隔离'},{name:'套装礼盒'},{name:'眼部护理'},{name:'美容仪器'}]},
        {name:'香水香氛', sub:[{name:'女士香水'},{name:'男士香水'},{name:'香水套装'},{name:'迷你香水'},{name:'香体走珠'}]},
        {name:'身体护理', sub:[{name:'洗发'},{name:'护发'},{name:'沐浴'},{name:'脱毛膏'},{name:'纤体瘦身'},{name:'染发造型'}]},
        {name:'魅力彩妆', sub:[{name:'粉底'},{name:'遮瑕'},{name:'卸妆'},{name:'睫毛膏'},{name:'唇彩'},{name:'化妆工具'},{name:'彩妆组合'},{name:'美甲'}]},
        {name:'男士护理', sub:[{name:'剃须护理'},{name:'防脱洗护'},{name:'脸部护理'},{name:'眼部护理'},{name:'男士唇膏'}]},
        {name:'个护清洁', sub:[{name:'纸品'},{name:'湿巾'},{name:'衣物清洁'},{name:'口腔护理'},{name:'女性护理'},{name:'家庭清洁'}]}
];
var class_8_menu =  [
        {name:'运动鞋服', sub:[{name:'跑步鞋'},{name:'休闲鞋/板鞋'},{name:'篮球鞋'},{name:'帆布鞋'},{name:'足球鞋'},{name:'训练鞋'},{name:'凉鞋/拖鞋'},{name:'运动套装'},{name:'运动T恤'},{name:'卫衣'},{name:'夹克'},{name:'运动长裤'},{name:'瑜伽'}]},
        {name:'户外鞋服', sub:[{name:'冲锋衣/裤'},{name:'软壳夹克'},{name:'速干衣/裤'},{name:'户外配饰'},{name:'登山鞋'},{name:'徒步鞋'},{name:'越野鞋'},{name:'休闲鞋'},{name:'溯溪鞋'},{name:'沙滩鞋/拖鞋'}]},
        {name:'户外装备', sub:[{name:'帐篷'},{name:'背包'},{name:'桌椅床'},{name:'望远镜'},{name:'照明'},{name:'垫子'},{name:'工具'},{name:'炊具'},{name:'垂钓'},{name:'烧烤'},{name:'军迷用品、'},{name:'其他'}]},
        {name:'运动器械', sub:[{name:'运动器材'},{name:'器械/跑步机'},{name:'护具'},{name:'自行车'},{name:'极限轮滑'},{name:'羽毛球'},{name:'网球'},{name:'乒乓球'},{name:'篮球'},{name:'足球'},{name:'瑜伽垫'},{name:'电子琴'},{name:'运动健康'},{name:'其他健身'}]},
        {name:'骑行运动', sub:[{name:'山地车'},{name:'电动车'},{name:'电动滑板车'},{name:'骑行装备'},{name:'公路车'},{name:'平衡车'},{name:'骑行保暖'},{name:'折叠车'},{name:'骑行服'},{name:'教育培训'},{name:'电动汽车'},{name:'装车服务'}]},
        {name:'登山攀岩', sub:[{name:'登山杖'},{name:'健走杖'},{name:'登山绳'},{name:'快挂/环钩'},{name:'登山配件'},{name:'安全头盔'},{name:'冰雪器材'}]}
];

var class_9_menu =  [
        {name:'宠物窝笼', sub:[{name:'笼子'},{name:'窝类'},{name:'饲养箱'}]},
        {name:'宠物用品', sub:[{name:'玩具'},{name:'厕所/尿垫'},{name:'食具水具'},{name:'清洁消毒'},{name:'玩具'},{name:'医疗保健'},{name:'木屑'},{name:'浴沙'}]},
        {name:'水族用品', sub:[{name:'鱼缸'},{name:'器材'},{name:'药剂'},{name:'鱼食'}]},
        {name:'宠物食品', sub:[{name:'幼猫猫粮'},{name:'成猫猫粮'},{name:'幼犬狗粮'},{name:'成犬狗粮'},{name:'妙鲜包'},{name:'罐头'},{name:'肉类零食'},{name:'磨牙洁齿'},{name:'饼干奶酪'}]},
        {name:'园艺休闲', sub:[{name:'园艺植物'},{name:'园艺工具'}]},
        {name:'鲜花绿植', sub:[{name:'鲜花速递'},{name:'绿植盆栽'},{name:'植物花卉'},{name:'美丽花器'}]}
];

var class_10_menu =  [
        {name:'婴儿奶粉', sub:[{name:'1段奶粉'},{name:'2段奶粉'},{name:'3段奶粉'},{name:'4段奶粉'},{name:'妈妈奶粉'},{name:'学前奶粉'}]},
        {name:'营养辅食', sub:[{name:'米粉/菜粉'},{name:'肉松/面类'},{name:'DHA'},{name:'钙铁锌硒'},{name:'宝宝零食'},{name:'宝宝零食'},{name:'清火开胃'}]},
        {name:'洗护尿裤', sub:[{name:'品牌尿裤'},{name:'NB码'},{name:'S码'},{name:'M码'},{name:'L码'},{name:'拉拉裤'},{name:'洗发'},{name:'沐浴'},{name:'清洁用品'}]},
        {name:'喂养用品', sub:[{name:'奶瓶'},{name:'奶嘴'},{name:'餐具'},{name:'饮具'},{name:'暖奶/消毒'},{name:'吸奶器'}]},
        {name:'床车用品', sub:[{name:'婴儿推车'},{name:'安全座椅'},{name:'餐椅'},{name:'摇椅'},{name:'婴儿床'},{name:'自行车'},{name:'电动车'}]},
        {name:'玩具乐器', sub:[{name:'益智玩具'},{name:'遥控电动'},{name:'积木拼插'},{name:'动漫模型'},{name:'健身玩具'},{name:'毛绒娃娃'},{name:'创意DIY'},{name:'乐器'}]}
];

var class_11_menu =  [
        {name:'整车服务', sub:[{name:'新车定金'},{name:'新车全款'},{name:'汽车保险'},{name:'维修保养'},{name:'摩托车全款'}]},
        {name:'车载电器', sub:[{name:'行车记录仪'},{name:'导航仪'},{name:'安全预警仪'},{name:'净化器'},{name:'冷暖箱'},{name:'吸尘器'},{name:'倒车雷达'},{name:'车载'},{name:'车载生活电器'},{name:'时尚影音'},{name:'蓝牙设备'},{name:'电源'}]},
        {name:'养护配件', sub:[{name:'机油'},{name:'添加剂'},{name:'防冻液'},{name:'空调养护'},{name:'刹车油'},{name:'底盘装甲'},{name:'水箱养护'},{name:'轮胎'},{name:'雨刷'},{name:'滤清器'},{name:'蓄电池'},{name:'车衣'},{name:'车灯/灯泡'},{name:'刹车片'},{name:'喇叭'},{name:'火花塞'},{name:'改装配件'},{name:'贴膜'}]},
        {name:'美容清洁', sub:[{name:'洗车机/水枪'},{name:'车蜡'},{name:'玻璃水'},{name:'清洁剂'},{name:'汽车配件'},{name:'补漆笔'}]},
        {name:'车饰精品', sub:[{name:'专车专用系列'},{name:'四季垫'},{name:'座套'},{name:'凉垫'},{name:'香水'},{name:'颈枕腰靠'},{name:'挂饰摆件'},{name:'功能精品'},{name:'内饰精品'},{name:'整理收纳'},{name:'脚垫'},{name:'毛垫'},{name:'多功能座垫'},{name:'后备箱垫'}]},
        {name:'安全自驾', sub:[{name:'儿童安全座椅'},{name:'防盗设备'},{name:'胎压监测'},{name:'应急救援'},{name:'自驾装备'},{name:'倒车雷达'},{name:'打气泵'},{name:'摩托车用品'},{name:'电动平衡车'}]}
];