function $(element) {
    return document.querySelector(element);
}

function $all(element) {
    return document.querySelectorAll(element);
}
// Get Total
$all(".total-data input").forEach(input => {
    input.addEventListener("input", () => {
        getTotal();
    });
});

function getTotal() {
    if($("#price").value) {
        let total = (+$("#price").value + +$("#taxes").value + +$("#ads").value) - $("#discount").value;
        $(".total").innerHTML = total;
        $(".total").style.cssText = "background-color: #040";
    } else {
        $(".total").innerHTML = "total";
        $(".total").style.cssText = "background-color: red";
    }
}

// Create Product
let dataPro;
if(localStorage.data) {
    dataPro = JSON.parse(localStorage.data);
} else {
    dataPro = [];
}

$("#create").addEventListener("click", () => {
    createPro();
    clearInputs();
    showData();
});
showData();

let indexUpdate;

function createPro() {
    let newPro = {
        title: $("#title").value,
        price: $("#price").value,
        taxes: $("#taxes").value,
        ads: $("#ads").value,
        discount: $("#discount").value,
        total: +$(".total").innerHTML || 0,
        count: $("#count").value || 1,
        category: $("#category").value,
    };
    if($("#create").innerHTML == "create") {
        for(let i=0;i<newPro.count;i++) {
            dataPro.push(newPro);
        }
    } else {
        dataPro[indexUpdate] = newPro;
    }
    // Save To Local Storage
    localStorage.setItem("data",JSON.stringify(dataPro));
}

function clearInputs() {
    $("#title").value = "";
    $("#price").value = ""; 
    $("#taxes").value = "";
    $("#ads").value = "";    
    $("#discount").value= "";
    $(".total").innerHTML = "total"; 
    $("#count").style.cssText = "display: block";  
    $("#count").value = "";
    $("#category").value ="";
    $(".total").style.cssText = "background-color: red";
    $("#create").innerHTML = "create";
}

// Read Data
function showData() {
    let table = "";
    for(let i=0;i<dataPro.length;i++) {
        table += `<tr>
        <td>${i+1}</td>
        <td>${dataPro[i]?.title || "unkown"}</td>
        <td>${dataPro[i]?.price || 0}</td>
        <td>${dataPro[i]?.taxes || 0}</td>
        <td>${dataPro[i]?.ads || 0}</td>
        <td>${dataPro[i]?.discount || 0}</td>
        <td>${dataPro[i]?.total === "total"?0:dataPro[i]?.total}</td>
        <td>${dataPro[i]?.category || "unkown"}</td>
        <td><button class="update" id="update" onclick=upPro(${i})>update</button></td>
        <td><button class="delete" id="delete" onclick=delPro(${i})>delete</button></td>
        </tr>`;
    }
    $(".tbody").innerHTML = table;
    $(".delete-all span").innerHTML = dataPro.length;
    $("#count-fun").innerHTML = "count of productes";
    $("#sum-fun").innerHTML = "total of prices"
    deleteAll();
}
// Delete & Update 
function delPro(index) {
    dataPro.splice(index,1);
    localStorage.data = JSON.stringify(dataPro);
    showData();
}

function deleteAll() {
    if(dataPro.length > 0) {
        $(".delete-all").style.cssText = "display: block";
    } else {
        $(".delete-all").style.cssText = "display: none";
    }
}

$(".delete-all").addEventListener("click", function() {
    dataPro.splice(0); // dataPro.splice(0, dataPro.length );
    localStorage.data = JSON.stringify(dataPro); // localStorage.clear() 
    showData();
});

function upPro(index) {
    $(".delete-all").style.cssText = "display: none";
    $("#title").value = dataPro[index].title;
    $("#price").value = dataPro[index].price;
    $("#taxes").value = dataPro[index].taxes;
    $("#ads").value = dataPro[index].ads;
    $("#discount").value = dataPro[index].discount;
    getTotal();
    $("#count").style.cssText = "display: none";
    $("#category").value = dataPro[index].category;
    $("#create").innerHTML = "update";
    indexUpdate = index;
    scroll({
        top: 0,
        behavior: "smooth"
    });
}

// Search
let searchMood = "title";

$all(".search-control div").forEach(e => {
    e.addEventListener("click", function() {
        searchMood = this.id;
        $("#search").focus();
        $("#search").value = "";
        $("#search").placeholder = `search by ${this.id}`;
        searchData("");
    });
});

$("#search").addEventListener("keyup", function() {
    searchData(this.value);
});

function searchData(value) {
    let table = "";
    for(let i=0; i<dataPro.length;i++) {
        if(dataPro[i][searchMood].toLowerCase().includes(value.toLowerCase())) {
            table += `<tr>
                <td>${i+1}</td>
                <td>${dataPro[i]?.title || "unkown"}</td>
                <td>${dataPro[i]?.price || 0}</td>
                <td>${dataPro[i]?.taxes || 0}</td>
                <td>${dataPro[i]?.ads || 0}</td>
                <td>${dataPro[i]?.discount || 0}</td>
                <td>${dataPro[i]?.total === "total"?0:dataPro[i]?.total || 0}</td>
                <td>${dataPro[i]?.category || "unkown"}</td>
                <td><button class="update" id="update" onclick=upPro(${i})>update</button></td>
                <td><button class="delete" id="delete" onclick=delPro(${i})>delete</button></td>
            </tr>`;
            $(".tbody").innerHTML = table;
        }
    }
}

$("#count-fun").addEventListener("click", () => {
    $("#count-fun").innerHTML = dataPro.length;
});

$("#sum-fun").addEventListener("click", () => {
    let sum = 0;
    for(let i=0;i<dataPro.length;i++) {
        if(dataPro[i].total != "Total") {
            sum+= +dataPro[i].total;
        }
    }
    $("#sum-fun").innerHTML = sum;
});