import "./style.css";

async function main() {
    const res = await fetch("/api/users/me");

    const body = await res.json();

    document.querySelector('#app').innerHTML = `
        <div>
            <div>${body.name} AAAA</div>
        </div>
    `;
}

main();
