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
        noTimeControl: "No time control",
        createParty: "Create party",
        initialTime: "Initial time",
        increment: "Increment",
        side: "Side",
        sideWhite: "White",
        sideRandom: "Random",
        sideBlack: "Black",
        confirmCreateParty: "Confirm"
      },
      playTab: {
        surrenderOffer: "Surrender?",
        drawOffer: "Offer draw?",
        drawOfferIncomingTitle: "Opponent offers a draw",
        drawOfferIncomingDescription: "Accept to finish the game as a draw, or decline. The offer is canceled after the next move.",
        declineDrawOffer: "Decline"
      }
    },
    challengePage: {
      title: "Challenge",
      subtitle: "Accept the invite and start a game from this link.",
      initiator: "Initiator",
      opponent: "Opponent",
      anyone: "Anyone with the link",
      side: "Your side",
      sideRandom: "Random",
      sideWhite: "White",
      sideBlack: "Black",
      boardView: "Board view",
      control: "Time control",
      link: "Challenge link",
      noTimeControl: "No time control",
      openToAnyone: "Any signed-in player except the initiator can accept.",
      accepting: "Accepting...",
      acceptAction: "Accept challenge",
      creatingParty: "Creating game",
      waitOnPageHint: "Stay on this page. The game will start as soon as another user accepts the challenge.",
      copyAction: "Copy",
      copySuccess: "Link copied.",
      copyError: "Failed to copy link.",
      acceptStub: "Visual stub: backend accept will be connected later.",
      acceptUnavailable: "You cannot accept this challenge.",
      createError: "Failed to create challenge.",
      createdGameNotFound: "Challenge accepted, but game id was not returned.",
      loadError: "Failed to load challenge.",
      acceptError: "Failed to accept challenge.",
      notFound: "Challenge not found",
      noAccess: "This challenge is reserved for another player."
    },
    challengesPage: {
      title: "Challenges",
      subtitle: "Browse all active challenges and open any challenge page directly.",
      empty: "No challenges yet.",
      loadErrorTitle: "Challenges are unavailable",
      loadErrorDescription: "Failed to load the challenge list.",
      anyone: "Anyone",
      noTimeControl: "No time control",
      sideWhite: "White",
      sideBlack: "Black",
      sideRandom: "Random",
      statusWaiting: "Waiting",
      statusAccepted: "Accepted",
      statusCreated: "Game created",
      columns: {
        initiator: "Initiator",
        access: "Access",
        side: "Side",
        timeControl: "Time control",
        status: "Status"
      }
    },
    usersPage: {
      title: "Players",
      empty: "No users found.",
      foundCount: "Found {shown} of {total} players",
      loadErrorTitle: "Users are unavailable",
      loadErrorDescription: "Failed to load the user list.",
      columns: {
        user: "User",
        status: "Status",
        registrationDate: "Registration date"
      },
      filters: {
        searchPlaceholder: "Search by username",
        allStatuses: "All statuses",
        onlineOnly: "Online only",
        offlineOnly: "Offline only"
      },
      sort: {
        nicknameAsc: "Name A-Z",
        nicknameDesc: "Name Z-A",
        createdDesc: "Newest first",
        createdAsc: "Oldest first"
      }
    },
    gameStatus: {
      draw: "Draw",
      whiteWin: "White wins",
      blackWin: "Black wins",
      notFinished: "Game in progress",
      timeoutWhiteWin: "White wins by timeout",
      timeoutBlackWin: "Black wins by timeout",
      surrenderWhiteWin: "White wins by surrender",
      surrenderBlackWin: "Black wins by surrender"
    },
    sidePanel: {
      profile: "Profile",
      game: "Play",
      challenges: "Challenges",
      users: "Players",
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
            noTimeControl: "Без контроля времени",
            createParty: "Создать партию",
            initialTime: "Основное время",
            increment: "Добавка",
            side: "Сторона",
            sideWhite: "Белые",
            sideRandom: "Рандом",
            sideBlack: "Черные",
            confirmCreateParty: "Подтвердить"
        },
        playTab: {
            surrenderOffer: "Cдаться?",
            drawOffer: "Предложить ничью?",
            drawOfferIncomingTitle: "Оппонент предлагает ничью",
            drawOfferIncomingDescription: "Примите предложение, чтобы завершить партию ничьей, или отклоните его. После следующего хода предложение отменится.",
            declineDrawOffer: "Отклонить"
        }
    },
    challengePage: {
        title: "Вызов",
        subtitle: "Примите приглашение и начните партию по этой ссылке.",
        initiator: "Инициатор",
        opponent: "Оппонент",
        anyone: "Любой по ссылке",
        side: "Ваша сторона",
        sideRandom: "Случайно",
        sideWhite: "Белые",
        sideBlack: "Черные",
        boardView: "Вид доски",
        control: "Контроль времени",
        link: "Ссылка на вызов",
        noTimeControl: "Без контроля времени",
        openToAnyone: "Принять может любой авторизованный игрок, кроме инициатора.",
        accepting: "Принятие...",
        acceptAction: "Принять вызов",
        creatingParty: "Создаем партию",
        waitOnPageHint: "Ожидайте на этой странице. Партия начнется сразу же, как другой пользователь примет вызов.",
        copyAction: "Копировать",
        copySuccess: "Ссылка скопирована.",
        copyError: "Не удалось скопировать ссылку.",
        acceptStub: "Пока это только визуальная заглушка: подключение принятия к бэкенду будет позже.",
        acceptUnavailable: "Вы не можете принять этот вызов.",
        createError: "Не удалось создать вызов.",
        createdGameNotFound: "Вызов принят, но id партии не вернулся.",
        loadError: "Не удалось загрузить вызов.",
        acceptError: "Не удалось принять вызов.",
        notFound: "Вызов не найден",
        noAccess: "Этот вызов предназначен другому игроку."
    },
    challengesPage: {
        title: "Вызовы",
        subtitle: "Список всех созданных вызовов с быстрым переходом на страницу конкретного вызова.",
        empty: "Вызовов пока нет.",
        loadErrorTitle: "Список вызовов недоступен",
        loadErrorDescription: "Не удалось загрузить список вызовов.",
        anyone: "Любой",
        noTimeControl: "Без контроля времени",
        sideWhite: "Белые",
        sideBlack: "Черные",
        sideRandom: "Случайно",
        statusWaiting: "Ожидает",
        statusAccepted: "Принят",
        statusCreated: "Партия создана",
        columns: {
            initiator: "Инициатор",
            access: "Доступ",
            side: "Сторона",
            timeControl: "Контроль времени",
            status: "Статус"
        }
    },
    usersPage: {
        title: "Игроки",
        empty: "Пользователи не найдены.",
        foundCount: "Найдено игроков: {shown} из {total}",
        loadErrorTitle: "Список пользователей недоступен",
        loadErrorDescription: "Не удалось загрузить список пользователей.",
        columns: {
            user: "Пользователь",
            status: "Статус",
            registrationDate: "Дата регистрации"
        },
        filters: {
            searchPlaceholder: "Поиск по имени",
            allStatuses: "Все статусы",
            onlineOnly: "Только онлайн",
            offlineOnly: "Только оффлайн"
        },
        sort: {
            nicknameAsc: "Имя А-Я",
            nicknameDesc: "Имя Я-А",
            createdDesc: "Сначала новые",
            createdAsc: "Сначала старые"
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
        challenges: "Вызовы",
        users: "Игроки",
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
