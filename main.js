/**
 * Created by beat on 2016/01/14.
 */

(function($){
    //画像関連
    var backImg;
    var monsterImg;
    var targetImg;
    var stage;

    //画像ロード
    function loadImage (imageData){
        //画像のロード
        var baseImg = new Image();
        baseImg.src = 'images/background1.png';
        backImg = new createjs.Bitmap(baseImg);

        var baseImg2 = new Image();
        baseImg2.src = 'images/target.png';
        targetImg = new createjs.Bitmap(baseImg2);

        //画像が選択されている時のみ合成
        if(imageData !== null) {
            var baseImg3 = new Image();
            baseImg3.src = imageData;
            monsterImg = new createjs.Bitmap(baseImg3);
        }

        stage = new createjs.Stage('result');
    }

    //画像と文字を合成する処理
    function genImage (imageIni, txt){
        //合成画像の設定
        //上下は10ピクセルごと移動
        monsterImg.x = imageIni.xPos * 10;
        monsterImg.y = imageIni.yPos * 10;
        //拡縮は10％ずつ
        monsterImg.scaleX = monsterImg.scaleX * (1 + imageIni.Scale / 10);
        monsterImg.scaleY = monsterImg.scaleY * (1 + imageIni.Scale / 10);

        //ステージ生成
        stage.addChild(backImg);
        stage.addChild(monsterImg);
        stage.addChild(targetImg);

        //文字オブジェクトを生成してステージに追加
        $.each(txt,function(key,value){
            //本文は入力された内容をそのまま取る
            var content = $('#' + key).val();

            if(key === 'txt02') {
              content = '/  cp' + content;
            }

            //文字生成
            var obj = new createjs.Text(content);

            //文字設定
            obj.textAlign = value.align;
            obj.font = value.font;
            obj.color = value.color;
            obj.x = value.x;
            obj.y = value.y;

            stage.addChild(obj);
        });

        //ステージ反映
        stage.update();
    }

    function downloadImage(imageData){
        window.location = imageData;
    }


    $(function(){
        //読込画像のオブジェクト
        var imageIni = {
            xPos : 20,
            yPos : 60,
            Scale : 0,
            imageData : null,
            resetImage : function(){
                this.xPos = 0;
                this.yPos = 0;
                this.Scale = 0;
            },
            makeImage : function(){
                if(this.imageData !== null) {
                    loadImage(this.imageData);
                    genImage(this, txt);
                }
            }
        };

        //合成する文字の位置情報などを定義
        var txt = {
            'txt01' : {
                'x' : 250,
                'y': 300,
                'font': '30px/1.5 Meiryo,sans-serif',
                'align': 'left',
                'color': 'white'
            },
            'txt02' : {
                'x' : 380,
                'y': 300,
                'font': '30px/1.5 Meiryo,sans-serif',
                'align': 'left',
                'color': 'white'
            }
        };

        $(window).on('load',function(){
            loadImage(null);
        });

        //画像読込
        $('#getfile').change(function (){
            //読み込み
            var fileList =$('#getfile').prop('files');
            var reader = new FileReader();
            reader.readAsDataURL(fileList[0]);

            //読み込み後
            $(reader).on('load',function(){
                $('#preview').prop('src',reader.result);
                imageIni.imageData = reader.result;
            });
        });

        //ボタンイベントまとめ
        $('.btn').on('click',function(e){
            if (e.target.id === "update"){
                //画像生成は個別処理なし
            }else if (e.target.id === "up"){
                imageIni.yPos -= 1;
            }else if (e.target.id === "down"){
                imageIni.yPos += 1;
            }else if (e.target.id === "left"){
                imageIni.xPos -= 1;
            }else if (e.target.id === "right") {
                imageIni.xPos += 1;
            }else if (e.target.id === "zoomin") {
                imageIni.Scale += 1;
            }else if (e.target.id === "zoomout") {
                imageIni.Scale -= 1;
            }else if (e.target.id === "reset"){
                imageIni.resetImage();
            }else if (e.target.id === "dl"){
                //TODO
                downloadImage(imageIni.imageData);
                return;
            }

            //画像操作時は再描画を行う
            if(imageIni.imageData !== null){
                imageIni.makeImage();
                $("#alert").text("");
            }else{
                $("#alert").text("画像を選択してから画像生成を行ってください");
            }
        });
    });
})($);
