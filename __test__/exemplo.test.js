// arquivo: __tests__/exemplo.test.js

// 'describe' agrupa testes relacionados
describe('Grupo de Testes de Exemplo', () => {

    // 'it' ou 'test' define um caso de teste individual
    it('deve retornar verdadeiro que 1 + 1 é igual a 2', () => {
        // 'expect' é a asserção, o que esperamos que aconteça
        expect(1 + 1).toBe(2);
    });

});