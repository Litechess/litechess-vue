import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    hello: "Hello",
    login: "Login",
    common: {
      accept: "Accept",
      cancel: "Cancel"
    },
    userPage: {
      registrationDate: "Registration date",
      status: "Status",
      online: "Online",
      offline: "Offline",
      stats: "Statistics",
      parties: "Games",
      statsTab: {
        parties: "Games",
        wins: "Wins",
        losses: "Losses",
        draws: "Draws"
      },
      partiesTab: {
        players: "Players",
        result: "Result",
        moves: "Moves",
        timeControl: "Time control"
      }
    },
    gameMode: {
      bullet: "Bullet",
      blitz: "Blitz",
      rapid: "Rapid"
    },
    time: {
      minutes: {
        short: "min"
      },
      seconds: {
        short: "s"
      }
    },
    boardPage: {
      matchmaking: "Matchmaking",
      play: "Play",
      matchmakingTab: {
        playButton: "Find game",
        cancelButton: "Cancel search",
        activeGame: "Active games",
        noTimeControl: "No time control"
      },
      playTab: {
        surrenderOffer: "Resign?",
        drawOffer: "Offer draw?"
      }
    },
    gameStatus: {
      draw: "Draw",
      whiteWin: "White wins",
      blackWin: "Black wins",
      notFinished: "Game in progress",
      timeoutWhiteWin: "White wins by timeout",
      timeoutBlackWin: "Black wins by timeout",
      surrenderWhiteWin: "White wins by resignation",
      surrenderBlackWin: "Black wins by resignation"
    },
    sidePanel: {
      profile: "Profile",
      game: "Play",
      exit: "Log out",
      language: 'Language'
    }
  },
  ru: {
    hello: "Привет",
    login: "Войти",
    common: {
        accept: "Принять",
        cancel: "Отмена"
    },
    userPage: {
        registrationDate: "Дата регистрации",
        status: "Статус",
        online: "Онлайн",
        offline: "Оффлайн",
        stats: "Статистика",
        parties: "Партии",
        statsTab: {
            parties: "Партии",
            wins: "Победы",
            losses: "Поражения",
            draws: "Ничьи",
        },
        partiesTab: {
            players: "Игроки",
            result: "Результат",
            moves: "Ходы",
            timeControl: "Контроль времени"
        }
    },
    gameMode: {
        bullet: "Пуля",
        blitz: "Блиц",
        rapid: "Рапид"
    },
    time: {
        minutes: {
            short: 'мин'
        },
        seconds: {
            short: 'с'
        }
    },
    boardPage: {
        matchmaking: "Поиск матча",
        play: "Игра",
        matchmakingTab: {
            playButton: "Найти игру",
            cancelButton: "Отменить поиск",
            activeGame: "Активные партии",
            noTimeControl: "Без контроля времени"
        },
        playTab: {
            surrenderOffer: "Cдаться?",
            drawOffer: "Предложить ничью?"
        }
        
    },
    gameStatus: {
        draw: "Ничья",
        whiteWin: "Победа белых",
        blackWin: "Победа черных",
        notFinished: "Игра продолжается",
        timeoutWhiteWin: "Победа белых по таймауту",
        timeoutBlackWin: "Победа черных по таймауту",
        surrenderWhiteWin: "Победа белых по сдаче",
        surrenderBlackWin: "Победа черных по сдаче"
    },

    sidePanel: {
        profile: "Профиль",
        game: "Играть",
        exit: "Выйти",
        language: 'Язык'
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'en',
  messages
})