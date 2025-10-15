document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api';
    const formProduto = document.getElementById('form-produto');
    const tabelaProdutos = document.getElementById('tabela-produtos');

    if (tabelaProdutos) {
        carregarProdutos();
        carregarFornecedoresDropdown(); 
        formProduto.addEventListener('submit', salvarProduto);
    }

    async function carregarFornecedoresDropdown() {
        try {
            const response = await fetch(`${API_URL}/fornecedores`);
            const fornecedores = await response.json();
            const selectFornecedor = document.getElementById('select-fornecedor');
            selectFornecedor.innerHTML = '<option value="">Sem Fornecedor</option>'; 
            
            fornecedores.forEach(fornecedor => {
                const option = document.createElement('option');
                option.value = fornecedor.id_fornecedor;
                option.textContent = fornecedor.nome_fantasia;
                selectFornecedor.appendChild(option);
            });
        } catch (error) {
            console.error('Falha ao carregar fornecedores no dropdown:', error);
        }
    }

    async function carregarProdutos() {
        try {
            const response = await fetch(`${API_URL}/produtos`);
            const produtos = await response.json();
            const tbody = tabelaProdutos.querySelector('tbody');
            tbody.innerHTML = '';
            produtos.forEach(produto => {
                const tr = document.createElement('tr');
                const nomeProdutoSeguro = produto.nome_produto.replace(/'/g, "\\'");
                tr.innerHTML = `
                    <td>${produto.id_produto}</td>
                    <td>${produto.nome_produto}</td>
                    <td>R$ ${parseFloat(produto.preco_venda).toFixed(2)}</td>
                    <td>${produto.estoque}</td>
                    <td>${produto.nome_fantasia || 'N/A'}</td>
                    <td>
                        <button class="btn-editar" onclick="prepararEdicaoProduto(${produto.id_produto},'${nomeProdutoSeguro}',${produto.preco_venda},${produto.estoque},${produto.id_fornecedor || 'null'})">Editar</button>
                        <button class="btn-excluir" onclick="excluirProduto(${produto.id_produto})">Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) { console.error('Falha ao carregar produtos:', error); }
    }

    async function salvarProduto(event) {
        event.preventDefault();
        const id = document.getElementById('produto-id').value;
        const produto = {
            nome_produto: document.getElementById('nome-produto').value,
            preco_venda: document.getElementById('preco-venda').value,
            estoque: document.getElementById('estoque').value,
            id_fornecedor: document.getElementById('select-fornecedor').value || null,
        };
        const url = id ? `${API_URL}/produtos/${id}` : `${API_URL}/produtos`;
        const method = id ? 'PUT' : 'POST';
        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(produto) });
        const resultado = await response.json();
        alert(resultado.mensagem);
        if (resultado.sucesso) {
            formProduto.reset();
            document.getElementById('produto-id').value = '';
            carregarProdutos();
        }
    }

    window.excluirProduto = async (id) => {
        if (confirm('Tem certeza?')) {
            const response = await fetch(`${API_URL}/produtos/${id}`, { method: 'DELETE' });
            const resultado = await response.json();
            alert(resultado.mensagem);
            if (resultado.sucesso) carregarProdutos();
        }
    }

    window.prepararEdicaoProduto = (id, nome, preco, estoque, id_fornecedor) => {
        document.getElementById('produto-id').value = id;
        document.getElementById('nome-produto').value = nome;
        document.getElementById('preco-venda').value = preco;
        document.getElementById('estoque').value = estoque;
        document.getElementById('select-fornecedor').value = id_fornecedor || '';
        window.scrollTo(0, 0);
    }

    const formCliente = document.getElementById('form-cliente');
    const tabelaClientes = document.getElementById('tabela-clientes');
    if (tabelaClientes) {
        carregarClientes();
        formCliente.addEventListener('submit', salvarCliente);
    }
    async function carregarClientes() {
        const response = await fetch(`${API_URL}/clientes`);
        const clientes = await response.json();
        const tbody = tabelaClientes.querySelector('tbody');
        tbody.innerHTML = '';
        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            const nomeClienteSeguro = cliente.nome_cliente.replace(/'/g, "\\'");
            tr.innerHTML = `
                <td>${cliente.id_cliente}</td>
                <td>${cliente.nome_cliente}</td>
                <td>${cliente.cpf || 'N/A'}</td>
                <td>${cliente.telefone || 'N/A'}</td>
                <td>${cliente.email || 'N/A'}</td>
                <td>
                    <button class="btn-editar" onclick="prepararEdicaoCliente(${cliente.id_cliente},'${nomeClienteSeguro}', '${cliente.cpf || ''}', '${cliente.telefone || ''}', '${cliente.email || ''}')">Editar</button>
                    <button class="btn-excluir" onclick="excluirCliente(${cliente.id_cliente})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    async function salvarCliente(event) {
        event.preventDefault();
        const id = document.getElementById('cliente-id').value;
        const cliente = {
            nome_cliente: document.getElementById('nome-cliente').value,
            cpf: document.getElementById('cpf-cliente').value,
            telefone: document.getElementById('telefone-cliente').value,
            email: document.getElementById('email-cliente').value,
        };
        const url = id ? `${API_URL}/clientes/${id}` : `${API_URL}/clientes`;
        const method = id ? 'PUT' : 'POST';
        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cliente) });
        const resultado = await response.json();
        alert(resultado.mensagem);
        if (resultado.sucesso) {
            formCliente.reset();
            document.getElementById('cliente-id').value = '';
            carregarClientes();
        }
    }
    window.excluirCliente = async (id) => {
        if (confirm('Tem certeza?')) {
            const response = await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
            const resultado = await response.json();
            alert(resultado.mensagem);
            if (resultado.sucesso) carregarClientes();
        }
    }
    window.prepararEdicaoCliente = (id, nome, cpf, telefone, email) => {
        document.getElementById('cliente-id').value = id;
        document.getElementById('nome-cliente').value = nome;
        document.getElementById('cpf-cliente').value = cpf;
        document.getElementById('telefone-cliente').value = telefone;
        document.getElementById('email-cliente').value = email;
        window.scrollTo(0, 0);
    }

    const formFornecedor = document.getElementById('form-fornecedor');
    const tabelaFornecedores = document.getElementById('tabela-fornecedores');
    if (tabelaFornecedores) {
        carregarFornecedores();
        formFornecedor.addEventListener('submit', salvarFornecedor);
    }
    async function carregarFornecedores() {
        const response = await fetch(`${API_URL}/fornecedores`);
        const fornecedores = await response.json();
        const tbody = tabelaFornecedores.querySelector('tbody');
        tbody.innerHTML = '';
        fornecedores.forEach(f => {
            const tr = document.createElement('tr');
            const nomeFantasiaSeguro = f.nome_fantasia.replace(/'/g, "\\'");
            const razaoSocialSeguro = (f.razao_social || '').replace(/'/g, "\\'");
            tr.innerHTML = `
                <td>${f.id_fornecedor}</td>
                <td>${f.nome_fantasia}</td>
                <td>${f.cnpj}</td>
                <td>${f.telefone || 'N/A'}</td>
                <td>${f.email || 'N/A'}</td>
                <td>
                    <button class="btn-editar" onclick="prepararEdicaoFornecedor(${f.id_fornecedor}, '${nomeFantasiaSeguro}', '${razaoSocialSeguro}', '${f.cnpj}', '${f.telefone || ''}', '${f.email || ''}')">Editar</button>
                    <button class="btn-excluir" onclick="excluirFornecedor(${f.id_fornecedor})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    async function salvarFornecedor(event) {
        event.preventDefault();
        const id = document.getElementById('fornecedor-id').value;
        const fornecedor = {
            nome_fantasia: document.getElementById('nome-fantasia').value,
            razao_social: document.getElementById('razao-social').value,
            cnpj: document.getElementById('cnpj').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value,
        };
        const url = id ? `${API_URL}/fornecedores/${id}` : `${API_URL}/fornecedores`;
        const method = id ? 'PUT' : 'POST';
        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fornecedor) });
        const resultado = await response.json();
        alert(resultado.mensagem);
        if (resultado.sucesso) {
            formFornecedor.reset();
            document.getElementById('fornecedor-id').value = '';
            carregarFornecedores();
        }
    }
    window.excluirFornecedor = async (id) => {
        if (confirm('Tem certeza?')) {
            const response = await fetch(`${API_URL}/fornecedores/${id}`, { method: 'DELETE' });
            const resultado = await response.json();
            alert(resultado.mensagem);
            if (resultado.sucesso) carregarFornecedores();
        }
    }
    window.prepararEdicaoFornecedor = (id, nome_fantasia, razao_social, cnpj, telefone, email) => {
        document.getElementById('fornecedor-id').value = id;
        document.getElementById('nome-fantasia').value = nome_fantasia;
        document.getElementById('razao-social').value = razao_social;
        document.getElementById('cnpj').value = cnpj;
        document.getElementById('telefone').value = telefone;
        document.getElementById('email').value = email;
        window.scrollTo(0, 0);
    }

const painelVenda = document.getElementById('painel-venda');

let itensVenda = [];

if (painelVenda) {
    carregarClientesParaVenda();
    carregarProdutosParaVenda();

    document.getElementById('btn-add-produto').addEventListener('click', adicionarItemVenda);

    document.getElementById('btn-finalizar-venda').addEventListener('click', finalizarVenda);
}

async function carregarClientesParaVenda() {
    const select = document.getElementById('select-cliente-venda');
    const response = await fetch(`${API_URL}/clientes`);
    const clientes = await response.json();
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id_cliente;
        option.textContent = cliente.nome_cliente;
        select.appendChild(option);
    });
}

async function carregarProdutosParaVenda() {
    const select = document.getElementById('select-produto-venda');
    const response = await fetch(`${API_URL}/produtos`);
    const produtos = await response.json();
    produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.id_produto;
        option.dataset.preco = produto.preco_venda;
        option.dataset.nome = produto.nome_produto;
        option.textContent = `${produto.nome_produto} - R$ ${produto.preco_venda}`;
        select.appendChild(option);
    });
}

function adicionarItemVenda() {
    const selectProduto = document.getElementById('select-produto-venda');
    const idProduto = selectProduto.value;
    const quantidade = parseInt(document.getElementById('quantidade-produto').value);

   
    if (!idProduto || quantidade <= 0) {
        alert("Selecione um produto e uma quantidade válida.");
        return;
    }

    const optionSelecionada = selectProduto.options[selectProduto.selectedIndex];
    const nomeProduto = optionSelecionada.dataset.nome;
    const precoUnitario = parseFloat(optionSelecionada.dataset.preco);

    itensVenda.push({
        id_produto: idProduto,
        nome_produto: nomeProduto,
        quantidade: quantidade,
        preco_unitario: precoUnitario,
        subtotal: quantidade * precoUnitario
    });
    
    atualizarTabelaItens();
}

function atualizarTabelaItens() {
    const tbody = document.getElementById('tabela-itens-venda').querySelector('tbody');
    tbody.innerHTML = '';
    let valorTotal = 0;

    itensVenda.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nome_produto}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${item.preco_unitario.toFixed(2)}</td>
            <td>R$ ${item.subtotal.toFixed(2)}</td>
            <td><button class="btn-excluir" onclick="removerItemVenda(${index})">Remover</button></td>
        `;
        tbody.appendChild(tr);
        valorTotal += item.subtotal;
    });

    document.getElementById('valor-total-venda').textContent = valorTotal.toFixed(2);
}

window.removerItemVenda = (index) => {
    itensVenda.splice(index, 1); 
    atualizarTabelaItens();
};


async function finalizarVenda() {
    if (itensVenda.length === 0) {
        alert("Adicione pelo menos um item para finalizar a venda.");
        return;
    }

    const idCliente = document.getElementById('select-cliente-venda').value;
    const valorTotal = itensVenda.reduce((total, item) => total + item.subtotal, 0);

    const dadosVenda = {
        id_cliente: idCliente || null,
        valor_total: valorTotal,
        itens: itensVenda 
    };

    const response = await fetch(`${API_URL}/vendas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosVenda)
    });

    const resultado = await response.json();
    alert(resultado.mensagem);

    if (resultado.sucesso) {
        itensVenda = [];
        atualizarTabelaItens();
        document.getElementById('select-cliente-venda').value = '';
    }
}

const painelRelatorio = document.getElementById('painel-relatorio');

if (painelRelatorio) {
    const botoesFiltro = document.querySelectorAll('.btn-filtro');

    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesFiltro.forEach(b => b.classList.remove('ativo'));
            botao.classList.add('ativo');

            const periodo = botao.dataset.periodo;
            carregarRelatorio(periodo);
        });
    });

    document.querySelector('.btn-filtro[data-periodo="dia"]').classList.add('ativo');
    carregarRelatorio('dia');
}

async function carregarRelatorio(periodo = 'dia') {
    const tituloRelatorio = document.getElementById('titulo-relatorio');
    if (periodo === 'dia') tituloRelatorio.textContent = 'Vendas de Hoje';
    if (periodo === 'semana') tituloRelatorio.textContent = 'Vendas desta Semana';
    if (periodo === 'mes') tituloRelatorio.textContent = 'Vendas deste Mês';

    try {
        const response = await fetch(`${API_URL}/relatorios?periodo=${periodo}`);
        const vendas = await response.json();
        const tbody = document.getElementById('tabela-relatorio').querySelector('tbody');
        tbody.innerHTML = '';

        if (vendas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhuma venda encontrada para este período.</td></tr>`;
            return;
        }

        vendas.forEach(venda => {
            const tr = document.createElement('tr');
            const dataFormatada = new Date(venda.data_venda).toLocaleString('pt-BR');

            tr.innerHTML = `
                <td>${venda.id_venda}</td>
                <td>${venda.nome_cliente || 'Consumidor não identificado'}</td>
                <td>${dataFormatada}</td>
                <td>R$ ${parseFloat(venda.valor_total).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar relatório:", error);
        const tbody = document.getElementById('tabela-relatorio').querySelector('tbody');
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Erro ao carregar dados.</td></tr>`;
    }
}

});