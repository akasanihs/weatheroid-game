enchant();

window.onload = () => {
	//ゲーム画面のサイズを引数で指定
	enchant.Sound.enabledInMobileSafari = true
	const game = new Game(400, 600)

	// 結果ツイート時にURLを貼るため、このゲームのURLをここに記入
	const url = encodeURI("https://akasanihs.github.io/weatheroid-game/")

	/////////////////////////////////////////////////
	// ゲーム開始前に必要な画像・音を読み込む部分
	// game.htmlからの相対パス

	// 音読み込み
	const ClickSound = "sound/click.wav"
	game.preload([ClickSound])
	// const BgmSound = "sound/bgm.mp3"
	// game.preload([BgmSound])
	const LemonSound = "sound/lemon.wav"
	game.preload([LemonSound])
	const HitSound = "sound/hit.wav"
	game.preload([HitSound])
	const MissSound = "sound/miss.wav"
	game.preload([MissSound])
	const TinSound = "sound/tin.wav"
	game.preload([TinSound])

	// ゲーム用の画像読み込み
	const TitleImg = "image/title.png"
	game.preload([TitleImg])
	const StartImg = "image/start_button.png"
	game.preload([StartImg])
	const WeatheroidImg0 = "image/weatheroid_0.png"
	game.preload([WeatheroidImg0])
	const WeatheroidImg1 = "image/weatheroid_1.png"
	game.preload([WeatheroidImg1])
	const FaceImg0 = "image/face_0.png"
	game.preload([FaceImg0])
	const FaceImg1 = "image/face_1.png"
	game.preload([FaceImg1])
	const CloudImg = "image/cloud.png"
	game.preload([CloudImg])
	const LemonImg = "image/lemon.png"
	game.preload([LemonImg])
	const CrabImg = "image/crab.png"
	game.preload([CrabImg])
	const BatteryImg = "image/battery.png"
	game.preload([BatteryImg])
	const LemonButtonImg0 = "image/lemon_button_0.png"
	game.preload([LemonButtonImg0])
	const LemonButtonImg1 = "image/lemon_button_1.png"
	game.preload([LemonButtonImg1])
	const ResultImg = "image/result.png"
	game.preload([ResultImg])
	const ToTitleImg = "image/title_button.png"
	game.preload([ToTitleImg])
	const ReplayImg = "image/replay_button.png"
	game.preload([ReplayImg])
	const TweetImg = "image/tweet_button.png"
	game.preload([TweetImg])

	//読み込み終わり
	/////////////////////////////////////////////////

	// ロード終了後にこの関数が実行される
	game.onload = () => {

		/////////////////////////////////////////////////
		//グローバル変数
		let IsStarted = false
		let Time = 0
		let Score = 0
		let Life = 3
		let IsInvincible = false
		let PonkoPos = {x: 300, y: 200, vx: 0, vy: 0}
		const PonkoSpeed = 0.1
		const PonkoMaxSpeed = 3
		let Crabs = []
		let CrabSpeed = 2
		let CrabFreq = 60
		const CrabModeNum = 3
		let LemonCutters = []

		// Titleシーンを生成
		const S_Title = new Scene()
		game.pushScene(S_Title)

		// タイトルの背景を生成
		const Title = new Sprite(400, 600)
		Title.moveTo(0, 0)
		Title.image = game.assets[TitleImg]
		S_Title.addChild(Title)

		// スタートボタンを生成
		const StartButton = new Sprite(183, 97)
		StartButton.moveTo(200, 250)
		StartButton.image = game.assets[StartImg]
		S_Title.addChild(StartButton)

		// Mainシーンを生成
		const S_MAIN = new Scene()
		S_MAIN.backgroundColor = "#a6ecff"

		// ヘッダーの背景を生成
		const Header = new Sprite(400, 50)
		const HeaderRect = new Surface(400, 50)
		Header.moveTo(0, 0)
		Header.image = HeaderRect
		S_MAIN.addChild(Header)
		HeaderRect.context.fillStyle = "#fffde6"
		HeaderRect.context.fillRect (0, 0, 400, 50)

		// スコア表示テキストを生成
		const ScoreLabel = new Label()
		ScoreLabel.font = "20px Meiryo"
		ScoreLabel.color = 'rgba(0,0,0,1)'
		ScoreLabel.width = 300
		ScoreLabel.moveTo(10, 18)
		S_MAIN.addChild(ScoreLabel)
		ScoreLabel.text = "最下位のかに座：" + Score + "匹"

		// ライフ表示画像を生成
		const LifeBattery = [new Sprite(22, 38), new Sprite(22, 38), new Sprite(22, 38)]
		for (let i = 0; i < LifeBattery.length; i++) {
			LifeBattery[i].moveTo(300+i*30, 5)
			LifeBattery[i].image = game.assets[BatteryImg]
			S_MAIN.addChild(LifeBattery[i])
		}

		// フッダーの背景を生成
		const Footer = new Sprite(400, 100)
		const FooterRect = new Surface(400, 100)
		Footer.moveTo(0, 500)
		Footer.image = FooterRect
		S_MAIN.addChild(Footer);
		FooterRect.context.fillStyle = "#fffde6"
		FooterRect.context.fillRect (0, 0, 400, 100)

		// AnalogPadを生成
		const AnalogPad = new APad();
		AnalogPad.moveTo(30, 500);
		S_MAIN.addChild(AnalogPad);

		// レモン(攻撃)ボタンを生成
		const PushedLemonButton = new Sprite(138, 98)
		PushedLemonButton.moveTo(210, 500)
		PushedLemonButton.image = game.assets[LemonButtonImg1]
		S_MAIN.addChild(PushedLemonButton)
		// 使用不可時のレモン(攻撃)ボタンを生成
		const LemonButton = new Sprite(138, 98)
		LemonButton.moveTo(210, 500)
		LemonButton.image = game.assets[LemonButtonImg0]
		S_MAIN.addChild(LemonButton)

		// ポン子の画像を生成
		const Ponko = new Sprite(100, 140)
		Ponko.moveTo(PonkoPos.x, PonkoPos.y)
		Ponko.image = game.assets[WeatheroidImg0]
		S_MAIN.addChild(Ponko)
		// 顔の画像を生成
		const Face = new Sprite(100, 140)
		Face.moveTo(PonkoPos.x, PonkoPos.y)
		Face.image = game.assets[FaceImg0]
		S_MAIN.addChild(Face)
		// レモンの画像を生成
		const Lemon = new Sprite(25, 22)
		Lemon.moveTo(PonkoPos.x+70, PonkoPos.y+55)
		Lemon.image = game.assets[LemonImg]
		Lemon.visible = false
		S_MAIN.addChild(Lemon)
		// 雲の画像を生成
		const Cloud = new Sprite(89, 30)
		Cloud.moveTo(PonkoPos.x+5, PonkoPos.y+105)
		Cloud.image = game.assets[CloudImg]
		S_MAIN.addChild(Cloud)

		// 初期化関数
		init = () => {
			IsStarted = false
			Time = 0
			Score = 0
			Life = 3
			IsInvincible = false
			PonkoPos = {x: 300, y: 200, vx: 0, vy: 0}
			Face.image = game.assets[FaceImg0]
			for (var i = 0; i < Crabs.length; i++) {
				if (Crabs[i] != null) deleteCrab(i, false)
			}
			Crabs = []
			for (var i = 0; i < LemonCutters.length; i++) {
				if (LemonCutters[i] != null) deleteLemonCutter(i)
			}
			CrabSpeed = 2
			CrabFreq = 60
			LemonCutters = []
			for (var i = 0; i < LifeBattery.length; i++) {
					LifeBattery[i].visible = true
			}
			LemonButton.visible = true
			Face.visible = true
			Ponko.visible = true
		}

		//グローバル変数終わり
		/////////////////////////////////////////////////
		StartButton.ontouchend = () => {
			StartButton.touchEnabled = false
			game.assets[ClickSound].clone().play()
			S_Title.tl.delay(15).then(() => {
				game.replaceScene(S_MAIN)
				IsStarted = true
				StartButton.touchEnabled = true
			})
		}

		LemonButton.ontouchend = () => {
			// LemonButton.touchEnabled = false
			LemonButton.visible = false
			Lemon.visible = true

			S_MAIN.tl.delay(3).then(() => {
				Ponko.image = game.assets[WeatheroidImg1]
				Lemon.visible = false

				// レモンカッターの画像を生成
				const LemonCutter = new Sprite(25, 22)
				LemonCutter.image = game.assets[LemonImg]
				LemonCutter.moveTo(PonkoPos.x+30, PonkoPos.y+65)

				S_MAIN.addChild(LemonCutter)
				LemonCutters.push(LemonCutter)

				game.assets[LemonSound].clone().play()
			})

			S_MAIN.tl.delay(10).then(() => {
				// LemonButton.touchEnabled = true
				Ponko.image = game.assets[WeatheroidImg0]
				if (IsInvincible === false){
						LemonButton.visible = true
				}
			})
		 }


		//メインループ
		game.onenterframe = () => {
			if (IsStarted) {
				ScoreLabel.text = "最下位のかに座：" + Score + "匹"
				movePonko()
				moveLemonCutter()
				createCrab()
				moveCrab()
				hitCrabAndLemon()
				hitCrabAndPonko()
				isGameover()
				// if (!isGameover()) {
				// 	game.assets[BgmSound].play()
				// }
				Time++
			}
		}

		isGameover = () => {
			if (Life <= 0) {
				if (Life === 0) {
					Life--
					// game.assets[BgmSound].stop()
					game.assets[TinSound].clone().play()
					const GameoverLabel = new Label()
					GameoverLabel.font = "30px Meiryo"
					GameoverLabel.color = 'rgba(255,0,0,1)'
					GameoverLabel.width = 300
					GameoverLabel.moveTo(100, 250)
					S_MAIN.addChild(GameoverLabel)
					GameoverLabel.text = "ゲームオーバー"
					GameoverLabel.tl.fadeIn(60).delay(120).then(() => {
						GameoverLabel.parentNode.removeChild(GameoverLabel)
						//ゲームオーバー後のテキスト表示
						ResultLabel.text = "最下位のかに座：" + Score + "匹"
						game.replaceScene(S_Result)
						})
				}
				return true
			} else {
				return false
			}
		}
		movePonko = () => {
			if (AnalogPad.isTouched) {
				PonkoPos.vx += AnalogPad.vx
				PonkoPos.vy += AnalogPad.vy
	    } else {
				PonkoPos.vx -= PonkoSpeed * Math.sign(PonkoPos.vx)
				PonkoPos.vy -= PonkoSpeed * Math.sign(PonkoPos.vy)
			}

			if (PonkoPos.vx < -PonkoMaxSpeed) { PonkoPos.vx = -PonkoMaxSpeed}
			if (PonkoPos.vx > PonkoMaxSpeed) { PonkoPos.vx = PonkoMaxSpeed}
			if (PonkoPos.vy < -PonkoMaxSpeed) { PonkoPos.vy = -PonkoMaxSpeed}
			if (PonkoPos.vy > PonkoMaxSpeed) { PonkoPos.vy = PonkoMaxSpeed}

			PonkoPos.x += Math.sign(PonkoPos.vx) * Math.floor(Math.abs(PonkoPos.vx))
			PonkoPos.y += Math.sign(PonkoPos.vy) * Math.floor(Math.abs(PonkoPos.vy))

			// 画面外に出ないようにする処理
			if (PonkoPos.x < 50) { PonkoPos.x = 50}
			if (PonkoPos.x > 300) { PonkoPos.x = 300}
			if (PonkoPos.y < 50) { PonkoPos.y = 50}
			if (PonkoPos.y > 360) { PonkoPos.y = 360}

			Ponko.moveTo(PonkoPos.x, PonkoPos.y)
			Face.moveTo(PonkoPos.x, PonkoPos.y)
			Lemon.moveTo(PonkoPos.x+70, PonkoPos.y+55)
			Cloud.moveTo(PonkoPos.x+5, PonkoPos.y+105)
		}
		createCrab = () => {
			if (Time % CrabFreq !== 0 || Time < 60) {
				return
			}

			const Crab = new Sprite(89, 63)
			const CrabPos = {
				x: -90,
				y: Math.floor(Math.random()*(430+1-60)+60),
				mode: Math.floor(Math.random()*CrabModeNum+1)
			}
			Crab.moveTo(CrabPos.x, CrabPos.y)
			Crab.image = game.assets[CrabImg]
			S_MAIN.addChild(Crab)

			const CrabHitbox = new Sprite(60, 40)
			CrabHitbox.moveTo(CrabPos.x+10, CrabPos.y+20)
			CrabHitbox.image = null
			S_MAIN.addChild(CrabHitbox);

			Crabs.push({sprite: Crab, pos: CrabPos, hitbox: CrabHitbox})
		}
		deleteCrab = (index, isFade) => {
			if (isFade) {
				const tmpSprite = Crabs[index].sprite
				Crabs[index].sprite.tl.fadeOut(10).then(() => {
					tmpSprite.parentNode.removeChild(tmpSprite)
				})
				Crabs[index].hitbox.parentNode.removeChild(Crabs[index].hitbox)
				Crabs[index] = null
			} else {
				Crabs[index].sprite.parentNode.removeChild(Crabs[index].sprite)
				Crabs[index].hitbox.parentNode.removeChild(Crabs[index].hitbox)
				Crabs[index] = null
			}

		}
		moveCrab = () => {
			if (Score >= 150) {
				CrabSpeed = 7
				CrabFreq = 50
			} else if (Score >= 50) {
				CrabSpeed = 5
				CrabFreq = 50
			} else if (Score >= 25) {
				CrabSpeed = 4
				CrabFreq = 55
			} else if (Score >= 10) {
				CrabSpeed = 3
				CrabFreq = 60
			}

			for (let i = 0; i < Crabs.length; i++) {
				if (Crabs[i] === null) {
					continue
				}
				switch (Crabs[i].pos.mode) {
			    case 0:
			        Crabs[i].pos.x += CrabSpeed
			        break;
			    case 1:
			        Crabs[i].pos.x += CrabSpeed
							Crabs[i].pos.y = Math.sin(Time/120 + Crabs[i].pos.x/120) * 185 + 245
			        break;
			    case 2:
			        Crabs[i].pos.x += CrabSpeed
							// Crabs[i].pos.y = Math.sin(Time) * 185 + 245
			        break;
					case 3:
			        Crabs[i].pos.x += CrabSpeed
							// Crabs[i].pos.y = Math.sin(Time) * 185 + 245
			        break;
				}

				// 画面外に出たら消す
				if (Crabs[i].pos.x > 400) {
					deleteCrab(i, false)
					continue
				}
				Crabs[i].sprite.moveTo(Crabs[i].pos.x, Crabs[i].pos.y)
				Crabs[i].hitbox.moveTo(Crabs[i].pos.x+10, Crabs[i].pos.y+20)
			}
		}
		deleteLemonCutter = (index) => {
			LemonCutters[index].parentNode.removeChild(LemonCutters[index])
			LemonCutters[index] = null
		}
		moveLemonCutter = () => {
			for (let i = 0; i < LemonCutters.length; i++) {
				if (LemonCutters[i] === null) {
					continue
				}
				LemonCutters[i].x -= 10

				// 画面外に出たら消す
				if (LemonCutters[i].x < 10) {
					deleteLemonCutter(i)
					continue
				}
			}
		}
		hitCrabAndLemon = () => {
			for (let i = 0; i < Crabs.length; i++) {
				if (Crabs[i] === null) {
					continue
				}
				for (let j = 0; j < LemonCutters.length; j++) {
					if (LemonCutters[j] === null) {
						continue
					}
					if (Crabs[i].hitbox.intersect(LemonCutters[j])) {
						game.assets[HitSound].clone().play()
						deleteCrab(i, true)
						deleteLemonCutter(j)
						Score++
						break
					}
				}
			}
		}
		hitCrabAndPonko = () => {
			// 無敵のチェックとその描画
			if (IsInvincible) {
				if(Time % 3 === 0 && Life > 0) {
					if (Ponko.visible) {
							Face.visible = false
							Ponko.visible = false
					} else {
						Face.visible = true
						Ponko.visible = true
					}
				}
				return
			}

			for (let i = 0; i < Crabs.length; i++) {
				if (Crabs[i] === null) {
					continue
				}
				if (Crabs[i].hitbox.intersect(Ponko)) {
					Life--
					if (Life > 0) {
							game.assets[MissSound].clone().play()
					}
					LifeBattery[Life].visible = false
					deleteCrab(i, false)
					IsInvincible = true
					LemonButton.visible = false
					Face.image = game.assets[FaceImg1]

					if (Life > 0) {
						S_MAIN.tl.delay(60).then(() => {
							IsInvincible = false
							LemonButton.visible = true
							Face.image = game.assets[FaceImg0]
							Face.visible = true
							Ponko.visible = true
						})
					}

				}
			}
		}

		////////////////////////////////////////////////////////////////
		//結果画面
		S_Result = new Scene()

		// 結果画面の背景
		const Result = new Sprite(400, 600)
		Result.moveTo(0, 0)
		Result.image = game.assets[ResultImg]
		S_Result.addChild(Result)

		// 結果のテキストラベル
		const ResultLabel = new Label()
		ResultLabel.font = "30px Meiryo"
		ResultLabel.color = 'rgba(0,0,0,1)'
		ResultLabel.width = 350
		ResultLabel.moveTo(50, 50)
		S_Result.addChild(ResultLabel)

		// かに
		const ResulCrab = new Sprite(89, 63)
		ResulCrab.moveTo(280, 130)
		ResulCrab.image = game.assets[CrabImg]
		S_Result.addChild(ResulCrab)

		// タイトルへもどるボタン
		const ToTitleButton = new Sprite(120, 85)
		ToTitleButton.moveTo(240, 370)
		ToTitleButton.image = game.assets[ToTitleImg]
		S_Result.addChild(ToTitleButton)
		ToTitleButton.ontouchend = () => {
			ToTitleButton.touchEnabled = false
			game.assets[ClickSound].clone().play()
			init()
			S_Result.tl.delay(15).then(() => {
					game.replaceScene(S_Title)
					ToTitleButton.touchEnabled = true
			})
		}

		// リプレイボタン
		const ReplayButton = new Sprite(120, 85)
		ReplayButton.moveTo(40, 260)
		ReplayButton.image = game.assets[ReplayImg]
		S_Result.addChild(ReplayButton)
		ReplayButton.ontouchend = () => {
			ReplayButton.touchEnabled = false
			game.assets[ClickSound].clone().play()
			init()
			IsStarted = true
			S_Result.tl.delay(15).then(() => {
					game.replaceScene(S_MAIN)
					ReplayButton.touchEnabled = true
			})
		}

		// ツイートボタン
		const TweetButton = new Sprite(120, 85)
		TweetButton.moveTo(240, 260)
		TweetButton.image = game.assets[TweetImg]
		S_Result.addChild(TweetButton)
		TweetButton.ontouchend = () => {
			window.open("http://twitter.com/intent/tweet?text=最下位のかに座は" + Score + "匹🦀🦀🦀🦀🦀%0A&hashtags=ウェザロゲーム&url=" + url)
		}

	}
	game.start()
}
