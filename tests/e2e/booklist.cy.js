const librosIniciales = [
  { id: '1', titulo: 'Sub terra', autor: 'Baldomero Lillo', categoria: 'Novela', descripcion: 'Cuentos de mineros.', fechaRegistro: '2026-01-01' },
  { id: '2', titulo: 'El hobbit', autor: 'J. R. R. Tolkien', categoria: 'Fantasía', descripcion: 'Una aventura inesperada.', fechaRegistro: '2026-01-01' },
  { id: '3', titulo: 'Historia de Chile', autor: 'Autora de prueba', categoria: 'Historia', descripcion: 'Un recorrido histórico.', fechaRegistro: '2026-01-01' }
]

function visitarConSesion(ruta = '/libros') {
  cy.visit(ruta, { onBeforeLoad(win) { win.sessionStorage.setItem('booklist_sesion', 'Constanza') } })
  cy.wait('@catalogo')
}

describe('BookList', () => {
  beforeEach(() => {
    // Toda petición de libros se intercepta: nunca se modifica db.json.
    cy.intercept('**/libros*', req => {
      if (req.method === 'GET') req.reply(librosIniciales)
      else req.reply({ statusCode: 501, body: { error: 'Operación sin respuesta de prueba' } })
    }).as('catalogo')
  })

  it('filtra por categoría, búsqueda y favoritos y permite limpiar los filtros', () => {
    visitarConSesion()
    cy.get('.libro-card').should('have.length', 3)
    cy.get('[data-testid="filtro-categoria"]').click()
    cy.get('.el-select-dropdown:visible').contains('.el-select-dropdown__item', 'Fantasía').click()
    cy.get('.libro-card').should('have.length', 1).and('contain', 'El hobbit')
    cy.contains('button', 'Limpiar filtros').click()
    cy.get('input[aria-label="Buscar por título o autor"]').type('Baldomero')
    cy.get('.libro-card').should('have.length', 1).and('contain', 'Sub terra')
    cy.get('.libro-card').contains('button', 'Favorito').click()
    cy.contains('button', 'Limpiar filtros').click()
    cy.contains('.el-checkbox', 'Ver solo favoritos').click()
    cy.get('.libro-card').should('have.length', 1).and('contain', 'Sub terra')
    cy.contains('button', 'Limpiar filtros').click()
    cy.get('.libro-card').should('have.length', 3)
  })

  it('protege el panel, valida el ingreso y cierra la sesión', () => {
    cy.visit('/panel')
    cy.location('pathname').should('eq', '/ingresar')
    cy.contains('button', 'Iniciar sesión').click()
    cy.get('[role="alert"]').should('contain', 'Escribe tu nombre')
    cy.get('#nombre-sesion').type('Constanza')
    cy.contains('button', 'Iniciar sesión').click()
    cy.wait('@catalogo')
    cy.location('pathname').should('eq', '/panel')
    cy.get('h1').should('contain', 'Constanza')
    cy.get('.estadisticas strong').first().should('have.text', '3')
    cy.reload()
    cy.wait('@catalogo')
    cy.get('h1').should('contain', 'Constanza')
    cy.contains('button', 'Cerrar sesión').click()
    cy.location('pathname').should('eq', '/ingresar')
    cy.visit('/libros')
    cy.location('pathname').should('eq', '/ingresar')
  })

  it('cambia el saludo y conserva el tema oscuro en una pantalla móvil', () => {
    cy.viewport(375, 812)
    visitarConSesion('/')
    cy.contains('button', 'Cambiar nombre').click()
    cy.get('#nombre-nuevo').clear().type('Coni')
    cy.contains('button', 'Guardar nombre').click()
    cy.get('.saludo').should('contain', 'Coni')
    cy.get('[data-testid="cambiar-tema"]').click()
    cy.get('html').should('have.class', 'dark')
    cy.reload()
    cy.wait('@catalogo')
    cy.get('html').should('have.class', 'dark')
    cy.get('.saludo').should('contain', 'Coni')
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(375))
    cy.screenshot('inicio-movil-oscuro')
    cy.get('nav').contains('Libros').click()
    cy.get('.libro-card').should('have.length', 3)
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(375))
    cy.screenshot('catalogo-movil-oscuro')
    cy.get('[data-testid="cambiar-tema"]').click()
    cy.get('html').should('not.have.class', 'dark')
  })

  it('cancela un borrador y guarda una edición confirmada por la API', () => {
    let libros = librosIniciales.map(libro => ({ ...libro }))
    cy.intercept('GET', '**/libros', () => {}).as('lectura')
    cy.intercept('GET', '**/libros', req => req.reply(libros)).as('catalogo')
    cy.intercept('PUT', '**/libros/1', req => {
      expect(req.body.id).to.eq('1')
      expect(req.body.fechaRegistro).to.eq('2026-01-01')
      libros[0] = req.body
      req.reply(req.body)
    }).as('guardar')
    visitarConSesion('/libros/1?editar=1')
    cy.get('#titulo').clear().type('Borrador descartado')
    cy.contains('button', 'Cancelar').click()
    cy.get('h1').should('have.text', 'Sub terra')
    cy.contains('button', 'Editar').click()
    cy.get('#titulo').clear().type('Sub terra revisado')
    cy.contains('button', 'Guardar cambios').click()
    cy.wait('@guardar')
    cy.get('h1').should('have.text', 'Sub terra revisado')
    cy.reload()
    cy.wait('@catalogo')
    cy.get('h1').should('have.text', 'Sub terra revisado')
  })

  it('distingue un error de API de un catálogo vacío y permite reintentar', () => {
    let llamadas = 0
    cy.intercept('GET', '**/libros', req => {
      llamadas += 1
      req.reply(llamadas === 1 ? { statusCode: 503, body: {} } : { body: librosIniciales })
    }).as('catalogo')
    visitarConSesion()
    cy.get('.error-carga').should('contain', 'No se pudo cargar el catálogo')
    cy.get('.el-empty').should('not.exist')
    cy.contains('button', 'Reintentar').click()
    cy.wait('@catalogo')
    cy.get('.libro-card').should('have.length', 3)
  })

  it('muestra la página 404 para una dirección desconocida', () => {
    cy.visit('/pagina-inexistente')
    cy.get('main').should('contain', '404').and('contain', 'Página no encontrada')
    cy.screenshot('pagina-404')
  })
})
