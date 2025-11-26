// ==== ЗАМЕНИТЕ ЭТОТ АДРЕС НА АДРЕС ВАШЕГО КОНТРАКТА ====
const contractAddress = 'ВАШ_АДРЕС_КОНТРАКТА_ЗДЕСЬ';

// ABI контракта SimpleStorage
const contractAbi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_message",
                "type": "string"
            }
        ],
        "name": "setMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMessage",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Основная логика приложения
if (window.ethereum) {
    let contract;
    let signer;

    // Инициализация при загрузке страницы
    async function init() {
        try {
            // Запрашиваем подключение аккаунтов
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Создаем провайдер и подписывающего
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractAbi, signer);

            // Получаем текущий адрес кошелька
            const address = await signer.getAddress();
            console.log('Подключен кошелек:', address);
            console.log('Контракт инициализирован:', contractAddress);

            setupEventListeners();
            
        } catch (error) {
            console.error("Ошибка инициализации:", error);
            alert('Ошибка подключения: ' + error.message);
        }
    }

    function setupEventListeners() {
        // Обработчик кнопки "Установить сообщение"
        document.getElementById('setMessageButton').onclick = async () => {
            const message = document.getElementById('messageInput').value;
            if (!message) {
                alert('Введите сообщение!');
                return;
            }

            try {
                console.log('Установка сообщения:', message);
                const transaction = await contract.setMessage(message);
                
                document.getElementById('messageDisplay').innerText = 'Транзакция отправлена...';
                document.getElementById('setMessageButton').disabled = true;
                
                // Ждем подтверждения транзакции
                await transaction.wait();
                
                alert('✅ Сообщение успешно установлено в контракте!');
                document.getElementById('messageInput').value = '';
                document.getElementById('setMessageButton').disabled = false;
                
            } catch (error) {
                console.error("Ошибка установки сообщения:", error);
                alert('❌ Ошибка: ' + error.message);
                document.getElementById('setMessageButton').disabled = false;
            }
        };

        // Обработчик кнопки "Получить сообщение"
        document.getElementById('getMessageButton').onclick = async () => {
            try {
                console.log('Получение сообщения...');
                const message = await contract.getMessage();
                document.getElementById('messageDisplay').innerText = message || '(пусто)';
                console.log('Полученное сообщение:', message);
            } catch (error) {
                console.error("Ошибка получения сообщения:", error);
                alert('Ошибка получения сообщения: ' + error.message);
            }
        };
    }

    // Запускаем инициализацию при загрузке страницы
    init();

} else {
    alert('Для работы приложения установите MetaMask!');
}