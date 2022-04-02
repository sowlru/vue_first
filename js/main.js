let app = new Vue({
    el: '.main',
    data: {
        showMain: true,
        showAchievements: false,
        showQuestions: false,
        showSocial: false,
        showResult: false,
        number: 0,
        score: {
            'zerg': 0,
            'primal': 0,
            'protoss': 0,
            'taldarim': 0,
            'terran': 0,
        },
        totalGame: localStorage.getItem('sc2TotalGame') ? 
            JSON.parse(localStorage.getItem('sc2TotalGame')) : {
                'zerg': 0,
                'primal': 0,
                'protoss': 0,
                'taldarim': 0,
                'terran': 0,
                'infested': 0,
                'hybrid': 0,
            },
        totalGames: localStorage.getItem('sc2TotalGame') ? 
            JSON.parse(localStorage.getItem('sc2TotalGame')) : 0,
        questions: questions,
        results: results,
        resultRace: 'infested',
    },
    methods: {
        goToMain() {
            this.showMain = true
            this.showAchievements = false
            this.showQuestions = false
            this.showSocial = false
            this.showResult = false
        },
        goToAchievements() {
            if(this.totalGames > 0) {
                this.showMain = false
                this.showAchievements = true
                this.showQuestions = false
                this.showSocial = false
                this.showResult = false
            } else {
                this.goToQuestions()
            }
        },
        goToQuestions() {
            this.score = {
                'zerg': 0,
                'primal': 0,
                'protoss': 0,
                'taldarim': 0,
                'terran': 0,
            },
            this.showMain = false
            this.showAchievements = false
            this.showQuestions = true
            this.showSocial = false
            this.showResult = false
        },
        goToSocial() {
            this.showMain = false
            this.showAchievements = false
            this.showQuestions = false
            this.showSocial = true
            this.showResult = false
        },
        goToResult(race) {
            this.showMain = false
            this.showAchievements = false
            this.showQuestions = false
            this.showSocial = false
            this.showResult = true
            this.resultRace = race
        },
        nextQuestions(answer) {
            if(this.number == 4) {
                this.number = 0
                this.endGame()
            } else {
                this.number++
            }
            eval(answer)
        },
        endGame() {
            this.totalGames++;
            localStorage.setItem('sc2TotalGame', this.totalGames)

            if(this.score.zerg > this.score.protoss && this.score.zerg > this.score.terran && 
                this.score.primal < 8 && Math.abs(this.score.protoss - this.score.zerg) > 3) {
                this.goToResult('zerg')
                this.totalGame.zerg++
            } else if (this.score.primal > this.score.zerg && this.score.protoss > this.score.terran && 
                this.score.taldarim < 5 && Math.abs(this.score.protoss - this.score.zerg) > 3) {
                this.goToResult('primal')
                this.totalGame.primal++
            } else if (this.score.protoss > this.score.zerg && this.score.protoss > this.score.terran && 
                this.score.taldarim < 5 && Math.abs(this.score.protoss - this.score.zerg) > 3) {
                this.goToResult('protoss')
                this.totalGame.protoss++
            } else if (this.score.protoss > this.score.zerg && this.score.protoss > this.score.terran && 
                this.score.taldarim == 5 ) {
                this.goToResult('taldarim')
                this.totalGame.taldarim++
            } else if (this.score.terran > this.score.zerg && this.score.terran > this.score.protoss) {
                this.goToResult('terran')
                this.totalGame.terran++
            } else if (Math.abs(this.score.protoss - this.score.zerg) <= 3) {
                this.goToResult('hybrid')
                this.totalGame.hybrid++
            } else {
                this.goToResult('infested')
                this.totalGame.infested++
            }
            localStorage.setItem('sc2TotalGame', JSON.stringify(this.totalGame))
        }
    },
    computed: {
        totalScore() {
            let score = 0
            for(let i in this.totalGame) {
                score += (this.totalGame[i] * results[i].points)
            }
            return score
        },
        openRaces()  {
            let count = 0
            for(let i in this.totalGame) {
                if(this.totalGame[i]>0) count++
            }
            return count
        },
        favoriteRace()  {
            let max = 'zerg'
            for(let i in this.totalGame) {
                if(this.totalGame[i]>this.totalGame[max]) {
                    max = i
                }
            }
            return results[max].name
        },
        showResultRace() {
            return {
                'zerg': this.totalGame.zerg > 0 ? true : false,
                'primal': this.totalGame.primal > 0 ? true : false,
                'protoss': this.totalGame.protoss > 0 ? true : false,
                'taldarim': this.totalGame.taldarim > 0 ? true : false,
                'terran': this.totalGame.terran > 0 ? true : false,
                'infested': this.totalGame.infested > 0 ? true : false,
                'hybrid': this.totalGame.hybrid > 0 ? true : false,
            }
        }
    }
})
let audio = new Audio('audio/soundtrack.mp3')
let audio_btn = document.querySelector('.btn__sound')
let audio_icon = document.querySelector('.btn__sound i')

audio.muted = true;
audio.autoplay = true;
audio.volume = 0.2

audio.addEventListener('loadmetadata', function() {
    audio.currentTime = 0 + Math.random() * (audio.duration + 1 -0)
})
audio_btn.addEventListener('click', function() {
    if(audio.muted) {
        audio.muted = false
        audio_icon.classList.add('fa-volume-up')
        audio_icon.classList.remove('fa-volume-off')
    } else if (!audio.muted) {
        audio.muted = true
        audio_icon.classList.add('fa-volume-off')
        audio_icon.classList.remove('fa-volume-up')
    }
})