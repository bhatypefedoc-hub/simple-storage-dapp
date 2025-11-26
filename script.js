// Адрес вашего развернутого контракта
const contractAddress = '0x688c0611a5691B7c1F09a694bf4ADfb456a58Cf7';

// ABI вашего контракта
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

// При подключении к MetaMask
if (window.ethereum) {
    // Запрашиваем подключение аккаунтов при загрузке
    window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(() => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);

            document.getElementById('setMessageButton').onclick = async () => {
                const message = document.getElementById('messageInput').value;
                if (message) {
                    try {
                        // Отправляем транзакцию и ждем подтверждения
                        const transaction = await contract.setMessage(message);
                        alert('Транзакция отправлена! Ожидаем подтверждения...');
                        
                        // Ждем подтверждения транзакции
                        await transaction.wait();
                        alert('Сообщение установлено!');
                        
                        // Очищаем поле ввода после успешной установки
                        document.getElementById('messageInput').value = '';
                    } catch (error) {
                        console.error("Ошибка:", error);
                        alert('Ошибка: ' + error.message);
                    }
                } else {
                    alert('Введите сообщение!');
                }
            };

            document.getElementById('getMessageButton').onclick = async () => {
                try {
                    const message = await contract.getMessage();
                    document.getElementById('messageDisplay').innerText = message;
                } catch (error) {
                    console.error("Ошибка получения сообщения:", error);
                    alert('Ошибка получения сообщения: ' + error.message);
                }
            };
        })
        .catch((error) => {
            console.error("Пользователь отказал в подключении:", error);
            alert('Необходимо разрешить подключение к MetaMask для работы с контрактом.');
        });
} else {
    alert('Установите MetaMask или другой кошелек.');
}
