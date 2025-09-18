const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

// Функция для получения индексов (продавцы, покупатели)
const getIndexes = async () => {
    // Загружаем данные с сервера, если они еще не загружены
    const sellersResponse = await fetch(`${BASE_URL}/sellers`);
    const customersResponse = await fetch(`${BASE_URL}/customers`);
    
    const sellers = await sellersResponse.json();
    const customers = await customersResponse.json();

    // Создаем индекс из полученных данных
    const sellersIndex = makeIndex(sellers, 'id', v => `${v.first_name} ${v.last_name}`);
    const customersIndex = makeIndex(customers, 'id', v => `${v.first_name} ${v.last_name}`);

    return { sellers: sellersIndex, customers: customersIndex };
};

// Функция для получения записей (продаж)
const getRecords = async (query) => {
    const qs = new URLSearchParams(query);
    const nextQuery = qs.toString(); // Преобразуем параметры в строку

    // Выполняем запрос к серверу для получения записей о продажах
    const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
    const records = await response.json();

    // Преобразуем данные в нужный формат
    const result = {
        total: records.total,
        items: records.items.map(item => ({
            id: item.receipt_id,
            date: item.date,
            seller: sellers[item.seller_id],
            customer: customers[item.customer_id],
            total: item.total_amount
        }))
    };

    return result;
};

export function initData() {
    return {
        getIndexes,
        getRecords
    };
}