---
title: Почему вы все еще не пишете на React Native?
date: '2016-10-31T00:56:48+06:00'
description: ''
author: binchik
---

Команда Anvilabs – большие фанаты нативной разработки на iOS. Наши приложения – [Сеансы](https://itunes.apple.com/app/id980255991), [BeautyBook](https://itunes.apple.com/kz/app/beautybook/id1069411501?mt=8), [Never Drink Alone](https://github.com/yenbekbay/never-drink-alone), [Kogershin](https://itunes.apple.com/ml/app/kogershin-treking-posylok/id1043220890?mt=8), [Metio](https://itunes.apple.com/ml/app/metio-intuitivnyj-mestnyj/id1055506207?mt=8) и множество других проектов, в которых мы принимали участие вне работы в Anvilabs – были написаны на Objective-C и Swift. Мы обожаем активно развивающийся Swift, протокольно-ориентированное программирование, архитектурные паттерны MVVM и VIPER.

В общем, мы не могли представить, как можно было оставить всю эту экосистему в пользу JavaScript фреймворков. Мобильные приложения на [Titanium](http://www.appcelerator.com), [Ionic](http://ionicframework.com) и подобных платформах казались и все еще кажутся нам страшной идеей. JavaScript был для нас языком третьего сорта. Отсутствие строгой системы типов, прототипно-ориентированное программирование и дурная слава сделали свое дело – мы боялись его.

<img src="mistake-hobbit.jpg" alt="Мем 'мы еще никогда так не ошибались'" width="639" />

Цель этого поста – описать почему мы отказались от нативной разработки в пользу React Native и почему вам следует поступить так же. Я бывший разработчик iOS на Objective-C и Swift, без опыта в Android, поэтому в моменты описания опыта нативной разработки пост будет больше об iOS.

## Почему React Native

Мы давно слышали о React Native, но несмотря на большое количество статей в интернете, не решались попробовать его в действии. Несколько месяцев назад мы должны были  начать новый проект – мобильное приложение на iOS и Android. На тот момент в нашей команде не было свободных Android разработчиков, и мы вспомнили о React Native.

Что же это такое? Ответ кроется в  названии – давайте рассмотрим обе его части отдельно.

### React

[React](https://facebook.github.io/react/) – это фреймворк для разработки пользовательских интерфейсов в вебе. Он находится в широком использовании у веб разработчиков, и судя по опросу [The State of JavaScript, не только обошел в популярности](http://stateofjs.com/2016/frontend/) [Angular](https://angularjs.org), но и является самым используемым фронт-енд фреймворком в вебе.

React предлагает строить пользовательский интерфейс из кирпичиков, которые принято называть компонентами. Каждый компонент сам управляет своим состоянием. Композиция этих компонентов в итоге становится вашим UI.

Лучше один раз увидеть, чем сто раз услышать. Давайте взглянем на пример React компонента. У компонентов есть метод `render`, который возвращает то, что нужно показать на экране:

```javascript
class HelloMessage extends Component {
  render() {
    return <div>Hello {this.props.name}</div>
  }
}

ReactDOM.render(<HelloMessage name="Anvilabs"} />, mountNode);
```

В примере выше мы показали простой React компонент `HelloMessage`. Синтаксис `<HelloMessage name="Anvilabs" />`, так похожий на HTML, на самом деле является расширением JavaScript и называется [JSX](https://facebook.github.io/react/docs/introducing-jsx.html). Значение атрибута `name` передается в объект `props` компонента `HelloMessage`.

Давайте рассмотрим пример чуточку сложнее:

```javascript
class RandomNumberList extends Component {
  constructor(props) {
    super(props);

    this.state = { randomNumbers: [] };
  }

  componentDidMount() {
    setInterval(() => this._addNumber(), 1000);
  }

  _addNumber() {
    this.setState({
      randomNumbers: [
        ...this.state.randomNumbers,
        Math.random(),
      ],
    });
  }

  render() {
    return (
      <ol>
        {this.state.randomNumbers.map((randomNumber) => (
          <li>randomNumber</li>	
        )}
      </ol>
    );
  }
}

ReactDOM.render(<RandomNumberList />, mountNode);
```

Компонент `RandomNumberList` служит для показа списка случайных чисел. Каждую секунду компонент генерирует новое число и добавляет его в конец списка. При добавлении нового случайного числа в массив `randomNumbers`, компонент заново вызывает метод `render`, но уже с новым объектом `state`.

Вам стало немного не по себе? Все верно, такой подход заметно отличается от архитектуры [MV(X)](https://www.linkedin.com/pulse/difference-between-mvc-mvp-mvvm-swapneel-salunkhe), предлагаемой к использованию в iOS, Android и множестве других платформ. В React, как и в React Native компоненты самодостаточны, что значит – каждый компонент отвечает за изменения в своем состоянии. Если бы генерация случайных чисел в предыдущем примере происходила на стороне сервера, мы бы скачивали эти данные в этом же компоненте.

Если бы мы реализовывали кнопку лайк, она бы отвечала за отправление запросов связанных с функциями лайка на сервер. Все, что компонент не может знать сам, передается ему через `props` (например *id* поста, к которому привязана кнопка лайк). Если необходимые данные можно получить в самом компоненте, они хранятся в специальном объекте `state`, либо в переменных класса (instance property). Разница в том, что при изменении `state` компонент обработается заново. Поэтому не стоит хранить в `state` значения, не влияющие на интерфейс.

Несмотря на то, что примеры выше – лишь верхушка айсберга, их достаточно для понимания основных принципов. Таким образом и строятся веб приложения на React: разработчик создает компоненты, комбинирует их, передает им параметры через `props` и при необходимости обновляет `state` .

### Native

Давайте ненадолго забудем о React, и вспомним какие решения на JavaScript нам предлагали для написания проектов на мобильные устройства.

Большинство прошлых попыток писать кроссплатформенные мобильные приложения на JavaScript основывались на принципах веб-приложений. Предложенные решения использовали HTML5, CSS, JS и запускались прямо в браузере мобильных устройств (в режиме полного экрана). С таким подходом невозможно добиться нативной производительности. Вдобавок, на устройствах эти гибридные приложения выглядели чужеродно.

<img src="hybrid-apps-grandma.jpg" alt="мем 'гибридные аппы – отстой!'" width="640" />

В отличие от своих предшественников, React Native – это не очередная попытка веб-сайта в имитации мобильного приложения. Результат кода React Native – это полноценное нативное приложение на iOS и/или Android (а еще [macOS](https://github.com/ptmt/react-native-macos), [Windows](https://github.com/ReactWindows/react-native-windows), [AppleTV](https://github.com/douglowder/react-native-appletv) и кто знает чего ещё).  Слоган React Native – “learn once, write anywhere". Вы можете переиспользовать большое количество кода, включая бизнес логику и даже некоторые компоненты между платформами.

Однако, iOS и Android имеют множество различий, начиная с работы API и заканчивая принципами дизайна. React Native предлагает разработчикам писать два отдельных приложения, на одних и тех же принципах, с максимальным объемом обмена кода между ними. 

#### Экспорт нативных модулей

iOS и Android имеют огромные SDK из тысячи модулей. Со стороны команды разработчиков React Native было бы нерационально экспортировать каждый из них в среду JavaScript. В редких случаях, когда API React Native недостаточен, вы можете обратиться к нативному коду на Objective-C, Swift и/или Java. Например, для приложения, над которым мы сейчас работаем, мне нужно было получить средний цвет верхней и нижней областей картинки. Не найдя способа проделать это в JavaScript, я решил эту проблему в нативной среде на Objective-C. Точно так же, разработчик может экспортировать функционал библиотек от третьих лиц.

#### Layout в React Native

Хочу отметить большое удовольствие работы с версткой. При создании пользовательского интерфейса в нативном коде, разработчики должны указывать точные координаты каждого UI элемента, независимо от того, используют они  AutoLayout или напрямую изменяют координаты и размер. Компоненты React Native добавляются на дерево компонентов как элементы HTML – каждый компонент отображается под предыдущим. Для манипуляции расположений разработчик использует [подмножество flexbox](https://facebook.github.io/react-native/docs/flexbox.html), позаимствованного с CSS. Благодаря этому, построение пользовательского интерфейса становится намного проще. Наконец-то можно забыть о сто и одном способе сделать это в iOS.

#### Время компиляции

Xcode очень долго компилирует Swift. О способах ускорения и анализа времени компиляции написано немало статей (просто впишите в Google "Swift compilation time"). Вы наверняка знаете разницу между [интерпретируемыми и компилируемыми языками](http://stackoverflow.com/questions/3265357/compiled-vs-interpreted-languages). И даже знаете, что JavaScript – интерпретируемый язык. Наверное поняли к чему я клоню? Да! React Native не компилирует код, вы можете запускать измененный JavaScript на реальном устройстве и на симуляторе с задержкой в пару секунд. Это очевидно сказывается на скорости разработки. Времени на кружку горячего кофе у вас больше не будет.

<img src="need-for-speed-forrest-gump.jpg" alt="мем 'Форрест Гамп жаждет скорости!'" width="610" />

#### Итог

TL;DR или краткий список преимуществ React Native перед нативной разработкой:

1. Переиспользование кода между iOS и Android.
2. Нативная разработка на JavaScript (один язык для мобильных приложений, веба и бэкенда).
3. Ускоренное время разработки – JavaScript не нужно компилировать; результат изменений кода виден в течение пары секунд.

Если мне не удалось убедить вас, [взгляните на список приложений, использующих React Native на официальном сайте](https://facebook.github.io/react-native/showcase.html). В этом списке можно заметить мобильные клиенты Facebook, Instagram, Airbnb и многие другие.

### В заключение

Еще на стадии черновика, эта статья  описывала еще и инструменты, которыми мы пользуемся для разработки на React и React Native: начиная с редактора кода, которым мы пользуемся, и заканчивая аннотациями типов в JavaScript. Со временем стало понятно, что цель поста размыта. Я пытался угнаться за семью зайцами, и в итоге не ловил ни одного. Как следствие, появился материал, который я вижу как основу для будущих постов. Напоследок советую посмотреть как наша команда использовала React при разработке нашего сайта – [репозиторий anvilabs.co](https://github.com/anvilabs/anvilabs.co).

<img src="wiggle-cat-wiggle-man.gif" alt="извивающийся кот и пританцовывающий мужчина" width="320" />