const baseURLOrders = "http://localhost:3000/orders"

function getOrders() {
    fetch(baseURLOrders)
        .then(res => res.json())
        .then(data => {
            displayOrders(data);
            console.log(data)
        })

}
getOrders()
const table = document.querySelector(".display-orders");

function displayOrders(data) {
    let html = "";
    if (data.length === 0) {
        html = `<p>No Orders Yet</p>`;
    } else {
        data.forEach(order => {
            html += `


            
            <tr>
                <td>${order.id}</td>
                <td>${order.total}</td>
                <td>${order.date}</td>
                <td>${order.username}</td>
            </tr>`;
        });
    }
    table.innerHTML = html;
}
