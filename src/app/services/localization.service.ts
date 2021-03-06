import { Injectable } from '@angular/core';
import {Store} from "@ngxs/store";
import {LocalStorageState} from "../store/states";

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

    private _languageCode = {
        Ru : 0,
	En : 1,
    }
    private _localization = {
        //Порядок значений в массиве, должен соответствовать индексам языкового кода
	//Например, первое значение на русском языке, второе - на английском
 	0 : ['Авторизация по номеру', 'Authorization by phone'],
	1 : ['Готово', 'Done'],
	2 : ['Отмена', 'Cancel'],
	3 : ['Обязательный', 'Required'],
	4 : ['Номер телефона', 'Phone number'],
	5 : ['10 цифр', '10 digits'],
	6 : ['Ожидание ввода истекло', 'Waiting for input has expired'] ,
	7 : ['Тест капчи не пройден', 'Captcha check failed'],
	8 : ['Не корректный номер', 'Invalid phone number'],
	9 : ['Номер не существует', 'Missing phone number'],
	10 : ['Превышена квота', 'Quota exceeded'],
	11 : ['Пользователь не активен', 'User disabled'],
	12 : ['Операция не разрешена', 'Operation not allowed'],
	13 : ['Тайм аут', 'Timeout'],
	14 : ['Ошибка работы капчи', 'Error of captcha work'],
	15 : ['Ошибка входа в приложение', 'Error logging in to the app'],
	16 : ['Примечание к авторизации', 'Note to authorization'],
	17 : ['После отправки авторизации, на указанный номер придет SMS сообщение, содержимое которого нужно будет внести в поле формы с наименованием "Код из SMS". Если введенный код окажется верным, Вы становитесь зарегистрированным пользователем и сможете приступить к использованию приложения.', 'After authorization is sent, an SMS message will be sent to the specified number, the contents of which will need to be entered in the form field with the name "code from SMS". If the entered code is correct, You become a registered user and can start using the app.'],
	18 : ['После отправки авторизации, приложение проверит наличие уже зарегистрированного в системе пользователя с переданными данными, и, если пользователь уже зарегистрирован, то произойдет Ваш вход в приложение с данными зарегистрированного пользователя. Если такого пользователя в системе не существует, то он будет создан.', 'After sending authorization, the app will check whether there is a user already registered in the system with the transmitted data, and if the user is already registered, then You will log in to the app with the data of the registered user. If such a user does not exist in the system, it will be created.'],
	19 : ['Анонимный вход позволяет совершить вызов только по номеру телефона, и предполагает оплату SMS сообщения для передачи вызова вызываемому контакту, что возможно только после пополнения баланса анонимного пользователя. Правила оплаты, свой баланс и тарифы можно найти после входа в приложение на закладке "Оплата и баланс".', 'Anonymous login allows you to make a call only by phone number, and involves paying for an SMS message to transfer the call to the called contact, which is possible only after adding funds to the anonymous user\'s balance. Payment rules, your balance and rates can be found after logging in to the app on the "Payment and balance"tab.'],
	20 : ['Код страны', 'Country code'],
	21 : ['Понятно', 'Clearly'],
	22 : ['Введите код, полученный в SMS сообщении', 'Enter the code you received in the SMS message'],
	23 : ['Код не верный', 'Invalid verification code'],
	24 : ['Код отсутствует', 'Missing verification code'],
	25 : ['Старт авторизации', 'Authorization start'],
	26 : ['Авторизация успешна', 'Successful authorization'],
	27 : ['Введите SMS код', 'Enter the SMS code'],
	28 : ['Код из SMS. 6 цифр', 'Code from the SMS. 6 digits'],
	29 : ['6 цифр', '6 digits'],
	30 : ['Ожидание входа в приложение', 'Waiting to log in to the app'],
	31 : ['Операция не разрешена', 'Operation not allowed'],
	32 : ['Запрос не выполнен', 'Network request failed'],
	33 : ['Анонимный вход', 'Anonymous login'],
	34 : ['Анонимный вход, позволяет не регистрироваться пользователю в системе. Такой способ не сохраняеет персональные данные, а так же настройки пользователя, его контакты, темы, не производит запись видеовызова и пр. Подробнее, о данном типе авторизации смотрите в примечании.', 'Anonymous login allows the user not to register in the system. This method does not save personal data, as well as user settings, contacts, themes, does not record a video call, and so on. For more information about this type of authorization, see the note.'],
	35 : ['Войти анонимно', 'Anonymous Login '],
	36 : ['Неверный email', 'Invalid email'],
	37 : ['Пользователь не активный', 'User disabled'],
	38 : ['Пользователь не найден', 'User not found'],
	39 : ['Неверный пароль', 'Wrong password'],
	40 : ['Email уже используется', 'Email already in use'],
	41 : ['Операция не разрешена', 'Operation not allowed'],
	42 : ['Слабый пароль', 'Weak password'],
	43 : ['Отсутствует url успешного перехода', 'Missing continue url'],
	44 : ['Не корректный url успешного перехода', 'invalid continue uri'],
	45 : ['Не авторизованный URL перехода', 'Unauthorized continue uri'],
	46 : ['Проверте почту для получения дальнейших инструкций', 'Check your email for further instructions'],
	47 : ['Ошибка при отправке подтверждения', 'Error when sending the confirmation'],
	48 : ['Пользователь аутентифицирован', 'User is authenticated'],
	49 : ['Регистрация нового пользователя', 'New user registration'],
	50 : ['Пользователь создан', 'User created'],
	51 : ['Авторизация по почте', 'Mail authorization'],
	52 : ['Примечание', 'Note'],
	53 : ['Email пользователя', 'User email'],
	54 : ['Введите корректный адрес почты', 'Enter the correct email'],
	55 : ['Пароль', 'Password'],
	56 : ['Пароль пользователя', 'User password'],
	57 : ['Скрыть', 'Hide'],
	58 : ['Напомнить', 'Remind'],
	59 : ['От 8 до 14 символов', 'From 8 to 14 characters'],
	60 : ['Слабый пароль', 'Weak password'],
	61 : ['Пропустить', 'Ignore'],
	62 : ['Одно или несколько аппаратных средств отключены. Включите не активные средства, перечисленные ниже, и повторите попытку входа в приложение.', 'One or more hardware devices are disabled. Enable the inactive devices listed below and try logging in to the app again.'],
	63 : ['Нет сети. Проверте подключение к сети и перезагрузите приложение или работайте автономно.', 'There is no network. Check your network connection and restart the app or work offline.'],
	64 : ['Перегрузить', ' Reload'],
	65 : ['Автономно', 'Offline'],
	66 : ['Приложению необходимо получить разрешение пользователя на отправку системных уведомлений. Это разрешение запрашивается один раз и в дальнейшем будет использоваться автоматически.', `The application needs to get the user's permission to send system notifications. This permission is requested once and will be used automatically in the future.`],
	67 : ['Пользователь не разрешил отправку уведомлений. Работа приложения невозможна. Снимите запрет отправки уведомлений и повторите попытку.', 'The user did not allow sending notifications. The app cannot work. Clear the ban on sending notifications and try again.'],
	68 : ['Приложению необходимо получить разрешение пользователя на использование камеры и микрофона. Это разрешение запрашивается один раз и в дальнейшем будет использоваться автоматически.', `The app needs to get the user's permission to use the camera and microphone. This permission is requested once and will be used automatically in the future.`],
	69 : ['Пользователь не разрешил использовать камеру и микрофон. Работа приложения невозможна. Снимите запрет использования камеры и микрофона и повторите попытку.', 'The user did not allow the use of the camera and microphone. The app cannot work. Remove the ban on the use of camera and microphone and try again.'],
	70 : ['Контакты', 'Contacts'],
	71 : ['Уведомления', 'Notifications'],
	72 : ['Сообщения', 'Messages'],
	73 : ['Настройки', 'Settings'],
	74 : ['Новое сообщение', 'New message'],
	76 : ['К сожалению, без решения данной проблемы, работа приложения невозможна!', 'Unfortunately, without solving this problem, the app cannot work!'],
	77 : ['Подробнее', 'More detailed'],
	78 : ['Добавить', 'Add'],
	79 : ['Удалить', 'Remove'], 
	80 : ['Общие', 'General'],
	81 : ['Дополнительные', 'Additional'],
	82 : ['Пользователь', 'User'],
	83 : ['Выход', 'Exit'],
	84 : ['Локализация', 'Localization'],
	85 : ['Исключить добавленные', 'Exclude added contacts'],
	86 : ['Ограничение контактов', 'Limitation of contacts'],
	87 : ['Режим отображения', 'Display mode'],
	88 : ['Камера, микрофон', 'Camera, microphone'],
	89 : ['Камера', 'Camera'],
	90 : ['Микрофон', 'Micriphone'],
	91 : ['Цветовая схема', 'Color scheme'],
	92 : ['Выход', 'Output'],
	93 : ['Имя, Телефон, Email', 'User name, phone, email'],
	94 : ['Редактор контакта', 'Contact editor'],
	95 : ['Редактор пользователя', 'User editor'],
	96 : ['Имя контакта', 'Contact name'],
	97 : ['Назад', 'Back'],
	98 : ['Добавить реквизит', 'Add a property'],
	99 : ['Сохранить', 'Save'],
	100 : ['Фамилия', 'Last name'],
	101 : ['Отчество', 'Middle name'],
	102 : ['Фамилия контакта', `contact's last name`] ,
	103 : ['Отчество контакта', `Contact's middle name`],
	104 : ['Телефон контакта', `Contact's phone number`],
	105 : ['Примечание', 'Note'],
	106 : ['Выбор иконки', 'Icon selection'] ,
	107 : ['Из файла', 'From а file'],
	108 : ['Проверить обновление', 'Check for updates'],
	109 : ['Режим обновления', 'Update mode']  ,
	110 : ['Проверять и обновлять', 'Update and reload'],
	111 : ['Обновления', 'Updates'],
	112 : ['Проверять', 'Check out'],
	113 : ['Не проверять' , 'Don`t check']  ,
	114 : ['Тема приложения', 'App theme'],
	115 : ['Текст сообщения' , 'Message text'],
	116 : ['Оптимизировать вызов', 'Optimize the call'] ,
	117 : ['Сохранять сообщения', 'Save messages'],
	118 : ['Дублировать вызов', 'Duplicate call'],
	119 : [ 'Длительность вызова (ms)' , 'Duration of the call (ms)'],
	120 : ['Режим вызова', 'Call mode'],
	121 : ['SMS Настройка', 'SMS Settings'],
	122 : ['Настройка SMS сервиса', 'SMS service settings'],
	123 : ['Для доступа любого пользователя к функциональности приложения отправки вызывающих SMS сообщений, в случаях установки соединения с не зарегистрированным удаленным пользователем, Вам необходимо пополнить счет оплаты этих сообщений. После пополнения счета, пользователю будет доступен сервис вызова ЛЮБОГО абонента различных телефонных сетей, по номеру его телефона.', 'In order for any user to access the functionality of the application for sending calling SMS messages, in cases of establishing a connection with an unregistered remote user, you need to top up the payment account for these messages. After adding funds to the account, the user will be able to call ANY subscriber of various telephone networks by their phone number.'] ,
	124 : ['Ваш баланс : ', 'Your balance : '],
	125 : ['Тарифы', 'Rates'],
	126 : ['Пополнение баланса SMS уведомлений', 'Topping up the balance of SMS notifications'],
	127 : ['Выберите платежную технологию', 'Choose a payment technology'],
    }
  constructor(private store : Store) { }
  
  getText(index){
     let lang = this.store.selectSnapshot(LocalStorageState.language);
     return this._localization[index][this._languageCode[lang]]
  }
}
