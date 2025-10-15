
  const urlParams = new URLSearchParams(window.location.search);
  const USER_ID = urlParams.get('user') || sessionStorage.getItem('salav:currentUserId') || 'anonymous_user';
  const USER_PROGRESS = urlParams.get('userprogress') || sessionStorage.getItem('salav:currentUserId') || 'anonymous_user';
  const formEl = document.getElementById('salav-form');
  const FORM_SLUG = (formEl && formEl.getAttribute('data-form')) ? formEl.getAttribute('data-form') : 'estudio_socioeconomico';
  const usuarioname = sessionStorage.getItem('nombre_seleccionado');
  const token_a = localStorage.getItem("access_token");
  const numerosolicitud = sessionStorage.getItem('numero_solicitud');
  
  let url_fotografia_upload = "";
  let url_croquis_upload = "";
  let url_ext_upload = "";
  let url_int_upload = "";
  let url_sala_upload = "";
  let url_docs_upload = "";
  let url_cv_upload = "";
  let url_comprobante_upload = "";
  let url_ine_upload = "";
  let url_cedula_upload = "";
  let url_constancia_upload = "";
  let url_cartas_upload = "";
  let url_curp_upload = "";
  let url_afore_upload = "";
  let url_fiscal_upload = "";
  let url_licencia_upload = "";
  let url_domicilio_upload = "";
  let url_nss_upload = "";
  let url_nacimiento_upload = "";
  let url_matrimonio_upload = "";
  let url_actahijo_upload = "";
  let url_actaconyuge_upload = "";




  function setUploadUrl(safeUploadId, url) {
  // safeUploadId ejemplo: "fotografia_upload"
  switch (String(safeUploadId)) {
    case 'fotografia_upload': url_fotografia_upload = url; break;
    case 'croquis_upload': url_croquis_upload = url; break;
    case 'ext_upload': url_ext_upload = url; break;
    case 'int_upload': url_int_upload = url; break;
    case 'sala_upload': url_sala_upload = url; break;
    case 'docs_upload': url_docs_upload = url; break;
    case 'cv_upload': url_cv_upload = url; break;
    case 'comprobante_upload': url_comprobante_upload = url; break;
    case 'ine_upload': url_ine_upload = url; break;
    case 'cedula_upload': url_cedula_upload = url; break;
    case 'constancia_upload': url_constancia_upload = url; break;
    case 'cartas_upload': url_cartas_upload = url; break;
    case 'curp_upload': url_curp_upload = url; break;
    case 'afore_upload': url_afore_upload = url; break;
    case 'fiscal_upload': url_fiscal_upload = url; break;
    case 'licencia_upload': url_licencia_upload = url; break;
    case 'domicilio_upload': url_domicilio_upload = url; break;
    case 'nss_upload': url_nss_upload = url; break;
    case 'nacimiento_upload': url_nacimiento_upload = url; break;
    case 'matrimonio_upload': url_matrimonio_upload = url; break;
    case 'actahijo_upload': url_actahijo_upload = url; break;
    case 'actaconyuge_upload': url_actaconyuge_upload = url; break;
    default:
      console.warn('setUploadUrl: safeUploadId no mapeado ->', safeUploadId);
      break;
  }
}

  async function finalizarTarea(userId, etapaKey, token) {
    
    //console.log(etapaKey, userId);
    try {
        // Crear un objeto dinámico con la clave de la etapa a actualizar
        const body = { [etapaKey]: true };

        const res = await axios.patch(`${API_URL}user-progress/${userId}`, body, {
        headers: { Authorization: `Bearer ${token_a}` }
        });

        mostrarModalMensaje("Tarea finalizada con éxito ✅");

        // Recargar los datos y refrescar la tabla
        await fetchUserProgress();
    } catch (error) {
        mostrarModalMensaje("❌ Ocurrió un error al finalizar la tarea");
    }
}

    /* -----------------------
     Helpers para DOM y creación dinámica
     ----------------------- */
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else node.setAttribute(k, v);
    });
    children.forEach(c => node.appendChild(c));
    return node;
  }

  /* -----------------------
     Dinámicos: Familiares
     ----------------------- */
  const familiaresWrap = document.getElementById('familiares-wrap');
  let familiarCount = 0;
  function addFamiliar(prefill = {}) {
    familiarCount++;
    const id = 'fam_' + familiarCount;
    const container = el('div', { class: 'salav-field salav-full', id: id + '_wrap' });
    container.style.border = '1px dashed rgba(27,27,27,0.06)';
    container.style.padding = '10px';
    container.style.borderRadius = '8px';

    const innerGrid = el('div', { class: 'salav-grid' });

    // fields: nombre, edad, parentesco, estudios, ocupacion, empresa, telefono
    const fields = [
      {id:`${id}_nombre`, label:'Nombre', type:'text', class:'salav-field'},
      {id:`${id}_edad`, label:'Edad', type:'number', class:'salav-field'},
      {id:`${id}_parentesco`, label:'Parentesco', type:'text', class:'salav-field'},
      {id:`${id}_estudios`, label:'Último grado de estudios', type:'select', options:['','Primaria','Secundaria','Preparatoria','Licenciatura','Maestría','Doctorado'], class:'salav-field'},
      {id:`${id}_ocupacion`, label:'Ocupación', type:'text', class:'salav-field'},
      {id:`${id}_empresa`, label:'Empresa para la que trabaja', type:'text', class:'salav-field'},
      {id:`${id}_telefono`, label:'Teléfono', type:'text', class:'salav-field'}
    ];

    fields.forEach(f => {
      const fld = el('div', { class: f.class });
      const lbl = el('label', { for: f.id, html: f.label });
      fld.appendChild(lbl);
      if (f.type === 'select') {
        const s = el('select', { id: f.id, name: f.id });
        f.options.forEach(opt => {
          const op = document.createElement('option'); op.innerText = opt; if (opt === '') op.value = '';
          s.appendChild(op);
        });
        fld.appendChild(s);
      } else {
        const inp = el('input', { id: f.id, name: f.id, type: f.type });
        if (f.type === 'number') inp.min = 0;
        fld.appendChild(inp);
      }
      innerGrid.appendChild(fld);
    });

    const removeBtn = el('button', { type: 'button', class: 'btn salav-small-btn', html: 'Eliminar familiar' });
    removeBtn.style.marginTop = '8px';
    removeBtn.addEventListener('click', () => {
      familiaresWrap.removeChild(container);
    });

    container.appendChild(innerGrid);
    container.appendChild(removeBtn);
    familiaresWrap.appendChild(container);

    // prefill values if provided
    Object.entries(prefill).forEach(([k,v]) => {
      const elField = document.getElementById(`${id}_${k}`);
      if (elField) elField.value = v;
    });
  }

  document.getElementById('add-familiar-btn').addEventListener('click', () => addFamiliar());

  // añadir inicialmente 1 familiar vacío (opcional)
  // addFamiliar();

  /* -----------------------
     Dinámicos: Niveles académicos
     ----------------------- */
  const nivelesWrap = []; 
document.getElementById('add-nivel-btn').addEventListener('click', function() {
  const idx = Date.now(); 
  const wrapper = el('div', { class: 'salav-grid', id: `nivel_wrap_${idx}` });
  wrapper.style.border = '1px dashed rgba(27,27,27,0.06)';
  wrapper.style.padding = '10px';
  wrapper.style.borderRadius = '8px';
  wrapper.style.marginTop = '8px';

  // Campo: Último nivel académico 
  const nivelField = el('div', { class: 'salav-field' });
  nivelField.appendChild(el('label', { for: `ultimo_nivel_${idx}`, html: 'Último nivel académico' }));
  const select = el('select', { id: `ultimo_nivel_${idx}`, name: 'ultimo_nivel[]' });
  ['', 'Primaria','Secundaria','Preparatoria','Carrera técnica','Licenciatura','Maestría','Doctorado']
    .forEach(opt => {
      const o = document.createElement('option'); o.value = opt; o.text = opt || '--';
      select.appendChild(o);
    });
  nivelField.appendChild(select);

  // Campo: Institución
  const institField = el('div', { class: 'salav-field' });
  institField.appendChild(el('label', { for: `institucion_${idx}`, html: 'Institución' }));
  institField.appendChild(el('input', { id: `institucion_${idx}`, name: 'institucion[]', type: 'text' }));

  // Campo: Entidad federativa
  const entidadField = el('div', { class: 'salav-field' });
  entidadField.appendChild(el('label', { for: `entidad_federativa_${idx}`, html: 'Entidad federativa' }));
  entidadField.appendChild(el('input', { id: `entidad_federativa_${idx}`, name: 'entidad_federativa[]', type: 'text' }));

  // Campo: Documento recibido (full width)
  const docField = el('div', { class: 'salav-field salav-full' });
  docField.appendChild(el('label', { for: `documento_recibido_${idx}`, html: 'Documento recibido' }));
  docField.appendChild(el('input', { id: `documento_recibido_${idx}`, name: 'documento_recibido[]', type: 'text', placeholder: 'Ej: certificado, constancia, etc.' }));

  // Botón eliminar
  const remBtn = el('button', { type: 'button', class: 'btn salav-small-btn', html: 'Eliminar nivel' });
  remBtn.style.marginTop = '8px';
  remBtn.addEventListener('click', () => wrapper.remove());

  // Armado
  wrapper.appendChild(nivelField);
  wrapper.appendChild(institField);
  wrapper.appendChild(entidadField);
  wrapper.appendChild(docField);
  wrapper.appendChild(remBtn);

  // Insertar dentro de la sección (niveles-wrap)
  const nivelesContainer = document.getElementById('niveles-wrap');
  if (nivelesContainer) nivelesContainer.appendChild(wrapper);
  else document.querySelector('.salav-carousel form').insertBefore(wrapper, document.querySelector('.salav-carousel form').lastElementChild);
});



  /* -----------------------
     Cursos (dinámico)
     ----------------------- */
  const cursosWrap = document.getElementById('cursos-wrap');
  let cursoCount = 0;
  document.getElementById('add-curso-btn').addEventListener('click', () => {
    cursoCount++;
    const id = 'curso_' + cursoCount;
    const cont = el('div', { class: 'salav-grid', id: id+'_wrap' });
    cont.style.border = '1px dashed rgba(27,27,27,0.06)';
    cont.style.padding = '8px';
    cont.style.borderRadius = '8px';

    const nombre = el('div', { class: 'salav-field' });
    nombre.appendChild(el('label', { for: id+'_nombre', html: 'Nombre del curso o certificación' }));
    nombre.appendChild(el('input', { id: id+'_nombre', name: id+'_nombre', type:'text' }));

    const duracion = el('div', { class: 'salav-field' });
    duracion.appendChild(el('label', { for: id+'_duracion', html: 'Duración en horas' }));
    duracion.appendChild(el('input', { id: id+'_duracion', name: id+'_duracion', type:'number' }));

    const remove = el('button', { type:'button', class:'btn salav-small-btn', html:'Eliminar' });
    remove.addEventListener('click', () => cont.remove());

    cont.appendChild(nombre); cont.appendChild(duracion); cont.appendChild(remove);
    cursosWrap.appendChild(cont);
  });

  /* -----------------------
     Empresas (dinámico)
     ----------------------- */
  const empresasWrap = document.getElementById('empresas-wrap');
  let empresaCount = 0;
  document.getElementById('add-empresa-btn').addEventListener('click', () => {
    empresaCount++;
    const id = 'empresa_' + empresaCount;
    const cont = el('div',{class:'salav-grid', id:id+'_wrap'});
    cont.style.border='1px dashed rgba(27,27,27,0.06)'; cont.style.padding='8px'; cont.style.borderRadius='8px';

    const nombre = el('div',{class:'salav-field'}); nombre.appendChild(el('label',{for:id+'_nombre',html:'Nombre / Razón social'})); nombre.appendChild(el('input',{id:id+'_nombre',name:id+'_nombre',type:'text'}));
    const periodo = el('div',{class:'salav-field'}); periodo.appendChild(el('label',{for:id+'_periodo',html:'Periodo'})); periodo.appendChild(el('input',{id:id+'_periodo',name:id+'_periodo',type:'text'}));
    const prestaciones = el('div',{class:'salav-field'}); prestaciones.appendChild(el('label',{for:id+'_prestaciones',html:'Prestaciones con las que contaba'})); 
    const sel = el('select',{id:id+'_prestaciones',name:id+'_prestaciones'}); ['No contaba','Prestaciones de ley','Prestaciones superiores'].forEach(o=>{const op=document.createElement('option');op.innerText=o;sel.appendChild(op);});
    prestaciones.appendChild(sel);
    const motivo = el('div',{class:'salav-field'}); motivo.appendChild(el('label',{for:id+'_motivo',html:'Motivo de finalización'})); motivo.appendChild(el('input',{id:id+'_motivo',name:id+'_motivo',type:'text'}));
    const rem = el('button',{type:'button',class:'btn salav-small-btn',html:'Eliminar'}); rem.addEventListener('click',()=>cont.remove());

    cont.appendChild(nombre); cont.appendChild(periodo); cont.appendChild(prestaciones); cont.appendChild(motivo); cont.appendChild(rem);
    empresasWrap.appendChild(cont);
  });

  /* -----------------------
     Referencias (dinámicas por tipo)
     ----------------------- */
  function addReferencia(wrapId, tipo) {
    const wrap = document.getElementById(wrapId);
    const cont = el('div',{class:'salav-grid'});
    cont.style.border='1px dashed rgba(27,27,27,0.06)'; cont.style.padding='8px'; cont.style.borderRadius='8px';

    const nombre = el('div',{class:'salav-field'}); nombre.appendChild(el('label',{html:'Nombre'})); nombre.appendChild(el('input',{type:'text'}));
    const relacion = el('div',{class:'salav-field'}); relacion.appendChild(el('label',{html: tipo === 'laboral' ? 'Puesto' : 'Parentesco'})); relacion.appendChild(el('input',{type:'text'}));
    const telefono = el('div',{class:'salav-field'}); telefono.appendChild(el('label',{html:'Teléfono / WhatsApp'})); telefono.appendChild(el('input',{type:'text'}));
    const tiempo = el('div',{class:'salav-field'}); tiempo.appendChild(el('label',{html:'¿Tiempo de conocerse?'})); tiempo.appendChild(el('input',{type:'text'}));
    const rem = el('button',{type:'button',class:'btn salav-small-btn',html:'Eliminar'}); rem.addEventListener('click',()=>cont.remove());

    cont.appendChild(nombre); cont.appendChild(relacion); cont.appendChild(telefono); cont.appendChild(tiempo); cont.appendChild(rem);
    wrap.appendChild(cont);
  }

  document.getElementById('add-ref-personal').addEventListener('click', ()=> addReferencia('refs-personales-wrap','personal'));
  document.getElementById('add-ref-laboral').addEventListener('click', ()=> addReferencia('refs-laborales-wrap','laboral'));
  document.getElementById('add-ref-vecinal').addEventListener('click', ()=> addReferencia('refs-vecinal-wrap','vecinal'));
  document.getElementById('add-ref-familiar').addEventListener('click', ()=> addReferencia('refs-familiar-wrap','familiar'));

  /* -----------------------
     Conditional show/hide logic for vehicle / motorcycle / celular and study field and health justifications
     ----------------------- */
  function toggleDisplay(selector, show) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    el.style.display = show ? '' : 'none';
  }

  // vehículo
  document.getElementById('tiene_vehiculo_si').addEventListener('change', ()=> toggleDisplay('#vehiculo-block', true));
  document.getElementById('tiene_vehiculo_no').addEventListener('change', ()=> toggleDisplay('#vehiculo-block', false));

    // motocicleta
    const cuentaMotocicleta = document.getElementById('cuenta_motocicleta');
    if (cuentaMotocicleta) {
        cuentaMotocicleta.addEventListener('change', (e) => {
            toggleDisplay('#motocicleta-block-HasData', e.target.value === 'Sí');
            toggleDisplay('#motocicleta-block-NullData', e.target.value === 'No');
        });
    }
    // celular
    const cuentaCelular = document.getElementById('cuenta_celular');
    if (cuentaCelular) {
        cuentaCelular.addEventListener('change', (e) => {
            toggleDisplay('#celular-block-HasData', e.target.value === 'Sí');
            toggleDisplay('#celular-block-NullData', e.target.value === 'No');
        });
    }
  // estudia actualmente
  document.querySelectorAll('input[name="estudia_actualmente"]').forEach(r => r.addEventListener('change', (e) => {
    toggleDisplay('#que_estudia_field', e.target.value === 'Sí');
  }));

  const healthPairs = [
    ['ha_consultado_medico', 'ha_consultado_medico_just'],
    ['ha_sufrido_cirugia', 'ha_sufrido_cirugia_just'],
    ['tiene_discapacidad', 'tiene_discapacidad_just'],
    ['practicado_estudios', 'practicado_estudios_just'],
    ['bajo_tratamiento', 'bajo_tratamiento_just'],
    ['transfusiones', 'transfusiones_just'],
    ['usa_drogas_prescripcion', 'usa_drogas_prescripcion_just'],
    ['enf_piel_sangre', 'enf_piel_sangre_just'],
    ['enf_ojo_oido', 'enf_ojo_oido_just'],
    ['enf_corazon', 'enf_corazon_just'],
    ['enf_pulmones', 'enf_pulmones_just'],
    ['enf_sistema_nervioso', 'enf_sistema_nervioso_just'],
    ['enf_glandular', 'enf_glandular_just'],
    ['enf_digestivo', 'enf_digestivo_just'],
    ['enf_musculo_esqueletico', 'enf_musculo_esqueletico_just'],
    ['enf_hernias', 'enf_hernias_just'],
    ['alergico_medicamento', 'alergico_medicamento_just'],
    ['otras_enfermedades', 'otras_enfermedades_just'],
    ['familiar_enfermedad', 'familiar_enfermedad_just'],
    ['padece_ansiedad', 'padece_ansiedad_just']
  ];
  healthPairs.forEach(([radioName, justId]) => {
    document.querySelectorAll(`input[name="${radioName}"]`).forEach(r => r.addEventListener('change', (e) => {
      toggleDisplay('#' + justId, e.target.value === 'Sí');
    }));
  });

  
  document.getElementById('salav-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // variables independientes 
    const correo = document.getElementById('correo').value;
    const folio = document.getElementById('folio').value;
    const fecha_solicitud = document.getElementById('fecha_solicitud').value;
    const fecha_visita = document.getElementById('fecha_visita').value;
    const puesto = document.getElementById('puesto').value;
    const fotografia = document.getElementById('fotografia').files.length ? Array.from(document.getElementById('fotografia').files).map(f=>f.name) : null;

    const valuador_nombre = document.getElementById('valuador_nombre').value;

    const solicitante_razon2 = document.getElementById('solicitante_razon2').value;
    const solicitante_contacto = document.getElementById('solicitante_contacto').value;
    const solicitante_email = document.getElementById('solicitante_email').value;

    const candidato_nombre = document.getElementById('candidato_nombre').value;
    const edad = document.getElementById('edad').value;
    const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
    const rfc = document.getElementById('rfc').value;
    const telefono = document.getElementById('telefono').value;
    const telefono_recados = document.getElementById('telefono_recados').value;
    const lugar_nacimiento = document.getElementById('lugar_nacimiento').value;
    const estado = document.getElementById('estado').value;
    const pais = document.getElementById('pais').value;
    const estado_civil = document.getElementById('estado_civil').value;
    const num_hijos = document.getElementById('num_hijos').value;
    const direccion = document.getElementById('direccion').value;
    const colonia = document.getElementById('colonia').value;
    const ciudad = document.getElementById('ciudad').value;
    const codigo_postal = document.getElementById('codigo_postal').value;
    const familia_empresa = document.querySelector('input[name="familia_empresa"]:checked') ? document.querySelector('input[name="familia_empresa"]:checked').value : null;
    const nombre_familiar = document.getElementById('nombre_familiar').value;

    // croquis / fotos
    const croquis = document.getElementById('croquis').files.length ? Array.from(document.getElementById('croquis').files).map(f=>f.name) : null;
    const foto_fachada_exterior = document.getElementById('foto_fachada_exterior').files.length ? Array.from(document.getElementById('foto_fachada_exterior').files).map(f=>f.name) : null;
    const foto_fachada_interior = document.getElementById('foto_fachada_interior').files.length ? Array.from(document.getElementById('foto_fachada_interior').files).map(f=>f.name) : null;
    const foto_sala = document.getElementById('foto_sala').files.length ? Array.from(document.getElementById('foto_sala').files).map(f=>f.name) : null;
    const foto_entregando_documentos = document.getElementById('foto_entregando_documentos').files.length ? Array.from(document.getElementById('foto_entregando_documentos').files).map(f=>f.name) : null;

    // familiares: leer dinámicos
    const familiares = [];
    document.querySelectorAll('#familiares-wrap > div').forEach((wrap, idx) => {
      const pref = {
        nombre: wrap.querySelector('input[id$="_nombre"]') ? wrap.querySelector('input[id$="_nombre"]').value : '',
        edad: wrap.querySelector('input[id$="_edad"]') ? wrap.querySelector('input[id$="_edad"]').value : '',
        parentesco: wrap.querySelector('input[id$="_parentesco"]') ? wrap.querySelector('input[id$="_parentesco"]').value : '',
        estudios: wrap.querySelector('select[id$="_estudios"]') ? wrap.querySelector('select[id$="_estudios"]').value : '',
        ocupacion: wrap.querySelector('input[id$="_ocupacion"]') ? wrap.querySelector('input[id$="_ocupacion"]').value : '',
        empresa: wrap.querySelector('input[id$="_empresa"]') ? wrap.querySelector('input[id$="_empresa"]').value : '',
        telefono: wrap.querySelector('input[id$="_telefono"]') ? wrap.querySelector('input[id$="_telefono"]').value : ''
      };
      familiares.push(pref);
    });

    // economía
    const sueldo_actual = document.getElementById('sueldo_actual').value;
    const ingresos_negocio = document.getElementById('ingresos_negocio').value;
    const ingresos_oficio = document.getElementById('ingresos_oficio').value;
    const otros_ingresos = document.getElementById('otros_ingresos').value;
    const ingresos_conyuge = document.getElementById('ingresos_conyuge').value;
    const ingresos_padres = document.getElementById('ingresos_padres').value;
    const ingresos_hijos = document.getElementById('ingresos_hijos').value;
    const ingresos_hermanos = document.getElementById('ingresos_hermanos').value;
    const otros_ingresos_familiares = document.getElementById('otros_ingresos_familiares').value;

    // gastos traslado
    const gasto_pasajes = document.getElementById('gasto_pasajes').value;
    const gasto_taxi = document.getElementById('gasto_taxi').value;
    const gasto_gasolina = document.getElementById('gasto_gasolina').value;
    const gasto_casetas = document.getElementById('gasto_casetas').value;

    // egresos mensuales
    const gasto_alimentacion = document.getElementById('gasto_alimentacion').value;
    const gasto_agua_potable = document.getElementById('gasto_agua_potable').value;
    const gasto_luz = document.getElementById('gasto_luz').value;
    const gasto_internet = document.getElementById('gasto_internet').value;
    const gasto_telefonia = document.getElementById('gasto_telefonia').value;
    const gasto_streaming = document.getElementById('gasto_streaming').value;
    const gasto_mantenimiento_hogar = document.getElementById('gasto_mantenimiento_hogar').value;
    const gasto_mantenimiento_vehicular = document.getElementById('gasto_mantenimiento_vehicular').value;
    const gasto_pension_alimenticia = document.getElementById('gasto_pension_alimenticia').value;
    const gasto_salidas_recreativas = document.getElementById('gasto_salidas_recreativas').value;
    const gasto_membresias = document.getElementById('gasto_membresias').value;
    const gasto_seguros_vida = document.getElementById('gasto_seguros_vida').value;
    const gasto_seguro_vehiculo = document.getElementById('gasto_seguro_vehiculo').value;
    const gasto_credito_vivienda = document.getElementById('gasto_credito_vivienda').value;
    const gasto_credito_vehicular = document.getElementById('gasto_credito_vehicular').value;
    const gasto_hipoteca = document.getElementById('gasto_hipoteca').value;
    const gasto_mascotas = document.getElementById('gasto_mascotas').value;
    const gasto_consultas_medicas = document.getElementById('gasto_consultas_medicas').value;
    const gasto_educacion = document.getElementById('gasto_educacion').value;
    const gasto_ropa_calzado = document.getElementById('gasto_ropa_calzado').value;

    // comodidades (vehiculo)
    const tiene_vehiculo = document.querySelector('input[name="tiene_vehiculo"]:checked') ? document.querySelector('input[name="tiene_vehiculo"]:checked').value : 'No';
    const veh_marca = document.getElementById('veh_marca').value;
    const veh_modelo = document.getElementById('veh_modelo').value;
    const veh_ano = document.getElementById('veh_ano').value;
    const veh_color = document.getElementById('veh_color').value;

    // comodidades 2
    const cuenta_computadora = document.getElementById('cuenta_computadora').value;
    const cuenta_bicicleta = document.getElementById('cuenta_bicicleta').value;
    const cuenta_tablet = document.getElementById('cuenta_tablet').value;
    const cuenta_refri = document.getElementById('cuenta_refri').value;
    const cuenta_tv = document.getElementById('cuenta_tv').value;
    const cuenta_microondas = document.getElementById('cuenta_microondas').value;
    const cuenta_estufa = document.getElementById('cuenta_estufa').value;
    const cuenta_lavadora = document.getElementById('cuenta_lavadora').value;
    const cuenta_motocicleta = document.getElementById('cuenta_motocicleta').value;

    // motocicleta details
    const moto_marca = document.getElementById('moto_marca').value;
    const moto_modelo = document.getElementById('moto_modelo').value;
    const moto_ano = document.getElementById('moto_ano').value;
    const moto_color = document.getElementById('moto_color').value;

    // comodidades 3
    const cuenta_camara = document.getElementById('cuenta_camara').value;
    const cuenta_freidora = document.getElementById('cuenta_freidora').value;
    const cuenta_horno_electrico = document.getElementById('cuenta_horno_electrico').value;
    const cuenta_batidora = document.getElementById('cuenta_batidora').value;
    const cuenta_tostador = document.getElementById('cuenta_tostador').value;
    const cuenta_dispensador = document.getElementById('cuenta_dispensador').value;
    const cuenta_licuadora = document.getElementById('cuenta_licuadora').value;
    const cuenta_tanque_gas = document.getElementById('cuenta_tanque_gas').value;
    const cuenta_celular = document.getElementById('cuenta_celular').value;

    // celular
    const cel_marca = document.getElementById('cel_marca').value;
    const cel_modelo = document.getElementById('cel_modelo').value;

    // comodidades 4
    const cuenta_cama = document.getElementById('cuenta_cama').value;
    const cuenta_sala = document.getElementById('cuenta_sala').value;
    const cuenta_cocina_integral = document.getElementById('cuenta_cocina_integral').value;
    const cuenta_closet = document.getElementById('cuenta_closet').value;
    const cuenta_banio = document.getElementById('cuenta_banio').value;
    const cuenta_calentador_solar = document.getElementById('cuenta_calentador_solar').value;
    const cuenta_calentador_boiler = document.getElementById('cuenta_calentador_boiler').value;
    const cuenta_panel_solar = document.getElementById('cuenta_panel_solar').value;

    // servicios zona
    const agua_potable = document.getElementById('agua_potable').value;
    const energia_electrica = document.getElementById('energia_electrica').value;
    const drenaje = document.getElementById('drenaje').value;
    const pavimentacion = document.getElementById('pavimentacion').value;
    const alumbrado_publico = document.getElementById('alumbrado_publico').value;
    const lineas_telefonicas = document.getElementById('lineas_telefonicas').value;
    const lineas_internet = document.getElementById('lineas_internet').value;
    const lineas_gas = document.getElementById('lineas_gas').value;
    const lineas_cable = document.getElementById('lineas_cable').value;
    const hospitales = document.getElementById('hospitales').value;
    const escuelas = document.getElementById('escuelas').value;
    const centros_comerciales = document.getElementById('centros_comerciales').value;
    const club_social_colonia = document.getElementById('club_social_colonia').value;
    const parques_recreativos = document.getElementById('parques_recreativos').value;
    const recoleccion_residuos = document.getElementById('recoleccion_residuos').value;
    const transporte_publico = document.getElementById('transporte_publico').value;
    const cuenta_metro = document.getElementById('cuenta_metro').value;
    const cuenta_teleferico = document.getElementById('cuenta_teleferico').value;

    // academicos base
    const ultimo_nivel = document.getElementById('ultimo_nivel').value;
    const institucion = document.getElementById('institucion').value;
    const entidad_federativa = document.getElementById('entidad_federativa').value;
    const documento_recibido = document.getElementById('documento_recibido').value;

    // datos academicos actuales
    const estudia_actualmente = document.querySelector('input[name="estudia_actualmente"]:checked') ? document.querySelector('input[name="estudia_actualmente"]:checked').value : 'No';
    const que_estudia = document.getElementById('que_estudia') ? document.getElementById('que_estudia').value : '';

    // cursos 
    const cursos = [];
    document.querySelectorAll('#cursos-wrap > div').forEach(c => {
      cursos.push({
        nombre: c.querySelector('input[type="text"]') ? c.querySelector('input[type="text"]').value : '',
        duracion_horas: c.querySelector('input[type="number"]') ? c.querySelector('input[type="number"]').value : ''
      });
    });

    // investigacion laboral 
    const empresas = [];
    document.querySelectorAll('#empresas-wrap > div').forEach(e => {
      empresas.push({
        nombre: e.querySelector('input[id$="_nombre"]') ? e.querySelector('input[id$="_nombre"]').value : '',
        periodo: e.querySelector('input[id$="_periodo"]') ? e.querySelector('input[id$="_periodo"]').value : '',
        prestaciones: e.querySelector('select[id$="_prestaciones"]') ? e.querySelector('select[id$="_prestaciones"]').value : '',
        motivo_fin: e.querySelector('input[id$="_motivo"]') ? e.querySelector('input[id$="_motivo"]').value : ''
      });
    });

    // referencias (por tipo)
    function readRefs(wrapperId) {
      const arr = [];
      document.querySelectorAll(`#${wrapperId} > div`).forEach(r => {
        const inputs = r.querySelectorAll('input');
        arr.push({
          nombre: inputs[0] ? inputs[0].value : '',
          relacion: inputs[1] ? inputs[1].value : '',
          telefono: inputs[2] ? inputs[2].value : '',
          tiempo_conocerse: inputs[3] ? inputs[3].value : ''
        });
      });
      return arr;
    }
    const refs_personales = readRefs('refs-personales-wrap');
    const refs_laborales = readRefs('refs-laborales-wrap');
    const refs_vecinal = readRefs('refs-vecinal-wrap');
    const refs_familiar = readRefs('refs-familiar-wrap');

    // salud: valores y justificaciones
    const nss = document.getElementById('nss').value;
    const tipo_sangre = document.getElementById('tipo_sangre').value;
    const estatura = document.getElementById('estatura').value;
    const peso = document.getElementById('peso').value;
    const utiliza_lentes = document.querySelector('input[name="utiliza_lentes"]:checked') ? document.querySelector('input[name="utiliza_lentes"]:checked').value : 'No';
    const justificacion_lentes = document.getElementById('justificacion_lentes').value;

    const health = {};
    health.ha_consultado_medico = document.querySelector('input[name="ha_consultado_medico"]:checked') ? document.querySelector('input[name="ha_consultado_medico"]:checked').value : 'No';
    health.ha_consultado_medico_just = document.getElementById('ha_consultado_medico_just').value;
    health.ha_sufrido_cirugia = document.querySelector('input[name="ha_sufrido_cirugia"]:checked') ? document.querySelector('input[name="ha_sufrido_cirugia"]:checked').value : 'No';
    health.ha_sufrido_cirugia_just = document.getElementById('ha_sufrido_cirugia_just').value;
    health.tiene_discapacidad = document.querySelector('input[name="tiene_discapacidad"]:checked') ? document.querySelector('input[name="tiene_discapacidad"]:checked').value : 'No';
    health.tiene_discapacidad_just = document.getElementById('tiene_discapacidad_just').value;
    health.practicado_estudios = document.querySelector('input[name="practicado_estudios"]:checked') ? document.querySelector('input[name="practicado_estudios"]:checked').value : 'No';
    health.practicado_estudios_just = document.getElementById('practicado_estudios_just').value;
    health.bajo_tratamiento = document.querySelector('input[name="bajo_tratamiento"]:checked') ? document.querySelector('input[name="bajo_tratamiento"]:checked').value : 'No';
    health.bajo_tratamiento_just = document.getElementById('bajo_tratamiento_just').value;
    health.transfusiones = document.querySelector('input[name="transfusiones"]:checked') ? document.querySelector('input[name="transfusiones"]:checked').value : 'No';
    health.transfusiones_just = document.getElementById('transfusiones_just').value;
    health.usa_drogas_prescripcion = document.querySelector('input[name="usa_drogas_prescripcion"]:checked') ? document.querySelector('input[name="usa_drogas_prescripcion"]:checked').value : 'No';
    health.usa_drogas_prescripcion_just = document.getElementById('usa_drogas_prescripcion_just').value;
    health.enf_piel_sangre = document.querySelector('input[name="enf_piel_sangre"]:checked') ? document.querySelector('input[name="enf_piel_sangre"]:checked').value : 'No';
    health.enf_piel_sangre_just = document.getElementById('enf_piel_sangre_just').value;
    health.enf_ojo_oido = document.querySelector('input[name="enf_ojo_oido"]:checked') ? document.querySelector('input[name="enf_ojo_oido"]:checked').value : 'No';
    health.enf_ojo_oido_just = document.getElementById('enf_ojo_oido_just').value;
    health.enf_corazon = document.querySelector('input[name="enf_corazon"]:checked') ? document.querySelector('input[name="enf_corazon"]:checked').value : 'No';
    health.enf_corazon_just = document.getElementById('enf_corazon_just').value;
    health.enf_pulmones = document.querySelector('input[name="enf_pulmones"]:checked') ? document.querySelector('input[name="enf_pulmones"]:checked').value : 'No';
    health.enf_pulmones_just = document.getElementById('enf_pulmones_just').value;
    health.enf_sistema_nervioso = document.querySelector('input[name="enf_sistema_nervioso"]:checked') ? document.querySelector('input[name="enf_sistema_nervioso"]:checked').value : 'No';
    health.enf_sistema_nervioso_just = document.getElementById('enf_sistema_nervioso_just').value;
    health.enf_glandular = document.querySelector('input[name="enf_glandular"]:checked') ? document.querySelector('input[name="enf_glandular"]:checked').value : 'No';
    health.enf_glandular_just = document.getElementById('enf_glandular_just').value;
    health.enf_digestivo = document.querySelector('input[name="enf_digestivo"]:checked') ? document.querySelector('input[name="enf_digestivo"]:checked').value : 'No';
    health.enf_digestivo_just = document.getElementById('enf_digestivo_just').value;
    health.enf_musculo_esqueletico = document.querySelector('input[name="enf_musculo_esqueletico"]:checked') ? document.querySelector('input[name="enf_musculo_esqueletico"]:checked').value : 'No';
    health.enf_musculo_esqueletico_just = document.getElementById('enf_musculo_esqueletico_just').value;
    health.enf_hernias = document.querySelector('input[name="enf_hernias"]:checked') ? document.querySelector('input[name="enf_hernias"]:checked').value : 'No';
    health.enf_hernias_just = document.getElementById('enf_hernias_just').value;
    health.alergico_medicamento = document.querySelector('input[name="alergico_medicamento"]:checked') ? document.querySelector('input[name="alergico_medicamento"]:checked').value : 'No';
    health.alergico_medicamento_just = document.getElementById('alergico_medicamento_just').value;
    health.otras_enfermedades = document.querySelector('input[name="otras_enfermedades"]:checked') ? document.querySelector('input[name="otras_enfermedades"]:checked').value : 'No';
    health.otras_enfermedades_just = document.getElementById('otras_enfermedades_just').value;
    health.familiar_enfermedad = document.querySelector('input[name="familiar_enfermedad"]:checked') ? document.querySelector('input[name="familiar_enfermedad"]:checked').value : 'No';
    health.familiar_enfermedad_just = document.getElementById('familiar_enfermedad_just').value;
    health.padece_ansiedad = document.querySelector('input[name="padece_ansiedad"]:checked') ? document.querySelector('input[name="padece_ansiedad"]:checked').value : 'No';
    health.padece_ansiedad_just = document.getElementById('padece_ansiedad_just').value;

    //Contactos de emergencia

    // CONTACTOS DE EMERGENCIA
    const contacto_emergencia_nombre = document.getElementById('emergencia1_nombre').value;
    const contacto_emergencia_parentesco = document.getElementById('emergencia1_parentesco').value;
    const contacto_emergencia_telefono = document.getElementById('emergencia1_telefono').value;
    const contacto_emergencia_nombre2 = document.getElementById('emergencia2_nombre').value;
    const contacto_emergencia_parentesco2 = document.getElementById('emergencia2_parentesco').value;
    const contacto_emergencia_telefono2 = document.getElementById('emergencia2_telefono').value;
    
    const contactos_emergencia = {
        contacto1: {
            nombre: contacto_emergencia_nombre,
            parentesco: contacto_emergencia_parentesco,
            telefono: contacto_emergencia_telefono
        },
        contacto2: {
            nombre: contacto_emergencia_nombre2,
            parentesco: contacto_emergencia_parentesco2,
            telefono: contacto_emergencia_telefono2
        }
    };

    // documentos (nombres de archivos)
    function filesList(id){ return document.getElementById(id) && document.getElementById(id).files.length ? Array.from(document.getElementById(id).files).map(f=>f.name) : null; }
    const cv = filesList('cv');
    const comprobante_estudios = filesList('comprobante_estudios');
    const identificacion_oficial = filesList('identificacion_oficial');
    const cedula_profesional = filesList('cedula_profesional');
    const constancia_laboral = filesList('constancia_laboral');
    const cartas_recomendacion = filesList('cartas_recomendacion');
    const curp = filesList('curp');
    const afore = filesList('afore');
    const constancia_fiscal = filesList('constancia_fiscal');
    const licencia_manejo = filesList('licencia_manejo');
    const comprobante_domicilio = filesList('comprobante_domicilio');
    const constancia_nss = filesList('constancia_nss');
    const acta_nacimiento_candidato = filesList('acta_nacimiento_candidato');
    const acta_matrimonio = filesList('acta_matrimonio');
    const acta_nacimiento_hijos = filesList('acta_nacimiento_hijos');
    const acta_nacimiento_conyuge = filesList('acta_nacimiento_conyuge');

    // conclusiones
    const info_coincide_final = document.getElementById('info_coincide_final').value;
    const vivienda_corresponde = document.getElementById('vivienda_corresponde').value;
    const entorno_adecuado = document.getElementById('entorno_adecuado').value;
    const problemas_analisis = document.getElementById('problemas_analisis').value;
    const problemas_visita = document.getElementById('problemas_visita').value;
    const problemas_agenda = document.getElementById('problemas_agenda').value;
    const candidato_proporciono_toda_info = document.getElementById('candidato_proporciono_toda_info').value;
    const obtencion_info_dentro_domicilio = document.getElementById('obtencion_info_dentro_domicilio').value;
    const actitud_candidato = document.getElementById('actitud_candidato').value;

    //console.log('correo:', correo);
    //console.log('folio:', folio);
    //console.log('fecha_solicitud:', fecha_solicitud);
    //console.log('fecha_visita:', fecha_visita);
    //console.log('puesto:', puesto);
    //console.log('fotografia:', fotografia);

    //console.log('valuador_nombre:', valuador_nombre);

    //console.log('solicitante_razon2:', solicitante_razon2);
    //console.log('solicitante_contacto:', solicitante_contacto);
    //console.log('solicitante_email:', solicitante_email);

    //console.log('candidato_nombre:', candidato_nombre);
    //console.log('edad:', edad);
    //console.log('fecha_nacimiento:', fecha_nacimiento);
    //console.log('rfc:', rfc);
    //console.log('telefono:', telefono);
    //console.log('telefono_recados:', telefono_recados);
    //console.log('lugar_nacimiento:', lugar_nacimiento);
    //console.log('estado:', estado);
    //console.log('pais:', pais);
    //console.log('estado_civil:', estado_civil);
    //console.log('num_hijos:', num_hijos);
    //console.log('direccion:', direccion);
    //console.log('colonia:', colonia);
    //console.log('ciudad:', ciudad);
    //console.log('codigo_postal:', codigo_postal);
    //console.log('familia_empresa:', familia_empresa);
    //console.log('nombre_familiar:', nombre_familiar);

    //console.log('croquis:', croquis);
    //console.log('foto_fachada_exterior:', foto_fachada_exterior);
    //console.log('foto_fachada_interior:', foto_fachada_interior);
    //console.log('foto_sala:', foto_sala);
    //console.log('foto_entregando_documentos:', foto_entregando_documentos);

    // imprimir familiares individualmente
    familiares.forEach((f, i) => {
      //console.log(`familiar_${i+1}_nombre:`, f.nombre);
      //console.log(`familiar_${i+1}_edad:`, f.edad);
      //console.log(`familiar_${i+1}_parentesco:`, f.parentesco);
      //console.log(`familiar_${i+1}_estudios:`, f.estudios);
      //console.log(`familiar_${i+1}_ocupacion:`, f.ocupacion);
      //console.log(`familiar_${i+1}_empresa:`, f.empresa);
      //console.log(`familiar_${i+1}_telefono:`, f.telefono);
    });

    // imprimir economía/gastos
    //console.log('sueldo_actual:', sueldo_actual);
    //console.log('ingresos_negocio:', ingresos_negocio);
    //console.log('ingresos_oficio:', ingresos_oficio);
    //console.log('otros_ingresos:', otros_ingresos);
    //console.log('ingresos_conyuge:', ingresos_conyuge);
    //console.log('ingresos_padres:', ingresos_padres);
    //console.log('ingresos_hijos:', ingresos_hijos);
    //console.log('ingresos_hermanos:', ingresos_hermanos);
    //console.log('otros_ingresos_familiares:', otros_ingresos_familiares);

    //console.log('gasto_pasajes:', gasto_pasajes);
    //console.log('gasto_taxi:', gasto_taxi);
    //console.log('gasto_gasolina:', gasto_gasolina);
    //console.log('gasto_casetas:', gasto_casetas);

    //console.log('gasto_alimentacion:', gasto_alimentacion);
    //console.log('gasto_agua_potable:', gasto_agua_potable);
    //console.log('gasto_luz:', gasto_luz);
    //console.log('gasto_internet:', gasto_internet);
    //console.log('gasto_telefonia:', gasto_telefonia);
    //console.log('gasto_streaming:', gasto_streaming);
    //console.log('gasto_mantenimiento_hogar:', gasto_mantenimiento_hogar);
    //console.log('gasto_mantenimiento_vehicular:', gasto_mantenimiento_vehicular);
    //console.log('gasto_pension_alimenticia:', gasto_pension_alimenticia);
    //console.log('gasto_salidas_recreativas:', gasto_salidas_recreativas);
    //console.log('gasto_membresias:', gasto_membresias);
    //console.log('gasto_seguros_vida:', gasto_seguros_vida);
    //console.log('gasto_seguro_vehiculo:', gasto_seguro_vehiculo);
    //console.log('gasto_credito_vivienda:', gasto_credito_vivienda);
    //console.log('gasto_credito_vehicular:', gasto_credito_vehicular);
    //console.log('gasto_hipoteca:', gasto_hipoteca);
    //console.log('gasto_mascotas:', gasto_mascotas);
    //console.log('gasto_consultas_medicas:', gasto_consultas_medicas);
    //console.log('gasto_educacion:', gasto_educacion);
    //console.log('gasto_ropa_calzado:', gasto_ropa_calzado);

    // comodidades
    //console.log('tiene_vehiculo:', tiene_vehiculo);
    //console.log('veh_marca:', veh_marca);
    //console.log('veh_modelo:', veh_modelo);
    //console.log('veh_ano:', veh_ano);
    //console.log('veh_color:', veh_color);

    //console.log('cuenta_computadora:', cuenta_computadora);
    //console.log('cuenta_bicicleta:', cuenta_bicicleta);
    //console.log('cuenta_tablet:', cuenta_tablet);
    //console.log('cuenta_refri:', cuenta_refri);
    //console.log('cuenta_tv:', cuenta_tv);
    //console.log('cuenta_microondas:', cuenta_microondas);
    //console.log('cuenta_estufa:', cuenta_estufa);
    //console.log('cuenta_lavadora:', cuenta_lavadora);
    //console.log('cuenta_motocicleta:', cuenta_motocicleta);

    //console.log('moto_marca:', moto_marca);
    //console.log('moto_modelo:', moto_modelo);
    //console.log('moto_ano:', moto_ano);
    //console.log('moto_color:', moto_color);

    //console.log('cuenta_camara:', cuenta_camara);
    //console.log('cuenta_freidora:', cuenta_freidora);
    //console.log('cuenta_horno_electrico:', cuenta_horno_electrico);
    //console.log('cuenta_batidora:', cuenta_batidora);
    //console.log('cuenta_tostador:', cuenta_tostador);
    //console.log('cuenta_dispensador:', cuenta_dispensador);
    //console.log('cuenta_licuadora:', cuenta_licuadora);
    //console.log('cuenta_tanque_gas:', cuenta_tanque_gas);
    //console.log('cuenta_celular:', cuenta_celular);

    //console.log('cel_marca:', cel_marca);
    //console.log('cel_modelo:', cel_modelo);

    //console.log('cuenta_cama:', cuenta_cama);
    //console.log('cuenta_sala:', cuenta_sala);
    //console.log('cuenta_cocina_integral:', cuenta_cocina_integral);
    //console.log('cuenta_closet:', cuenta_closet);
    //console.log('cuenta_banio:', cuenta_banio);
    //console.log('cuenta_calentador_solar:', cuenta_calentador_solar);
    //console.log('cuenta_calentador_boiler:', cuenta_calentador_boiler);
    //console.log('cuenta_panel_solar:', cuenta_panel_solar);

    //console.log('agua_potable:', agua_potable);
    //console.log('energia_electrica:', energia_electrica);
    //console.log('drenaje:', drenaje);
    //console.log('pavimentacion:', pavimentacion);
    //console.log('alumbrado_publico:', alumbrado_publico);
    //console.log('lineas_telefonicas:', lineas_telefonicas);
    //console.log('lineas_internet:', lineas_internet);
    //console.log('lineas_gas:', lineas_gas);
    //console.log('lineas_cable:', lineas_cable);
    //console.log('hospitales:', hospitales);
    //console.log('escuelas:', escuelas);
    //console.log('centros_comerciales:', centros_comerciales);
    //console.log('club_social_colonia:', club_social_colonia);
    //console.log('parques_recreativos:', parques_recreativos);
    //console.log('recoleccion_residuos:', recoleccion_residuos);
    //console.log('transporte_publico:', transporte_publico);
    //console.log('cuenta_metro:', cuenta_metro);
    //console.log('cuenta_teleferico:', cuenta_teleferico);

    //console.log('ultimo_nivel:', ultimo_nivel);
    //console.log('institucion:', institucion);
    //console.log('entidad_federativa:', entidad_federativa);
    //console.log('documento_recibido:', documento_recibido);

    //console.log('estudia_actualmente:', estudia_actualmente);
    //console.log('que_estudia:', que_estudia);

    // cursos
    cursos.forEach((c,i) => {
      //console.log(`curso_${i+1}_nombre:`, c.nombre);
      //console.log(`curso_${i+1}_duracion_horas:`, c.duracion_horas);
    });

    // empresas (laboral)
    // empresas.forEach((e,i) => {
    //   //console.log(`empresa_${i+1}_nombre:`, e.nombre);
    //   //console.log(`empresa_${i+1}_periodo:`, e.periodo);
    //   //console.log(`empresa_${i+1}_prestaciones:`, e.prestaciones);
    //   //console.log(`empresa_${i+1}_motivo_fin:`, e.motivo_fin);
    // });

    // // referencias
    // refs_personales.forEach((r,i)=> //console.log(`ref_personal_${i+1}:`, r));
    // refs_laborales.forEach((r,i)=> //console.log(`ref_laboral_${i+1}:`, r));
    // refs_vecinal.forEach((r,i)=> //console.log(`ref_vecinal_${i+1}:`, r));
    // refs_familiar.forEach((r,i)=> //console.log(`ref_familiar_${i+1}:`, r));

    // salud
    //console.log('nss:', nss);
    //console.log('tipo_sangre:', tipo_sangre);
    //console.log('estatura:', estatura);
    //console.log('peso:', peso);
    //console.log('utiliza_lentes:', utiliza_lentes);
    //console.log('justificacion_lentes:', justificacion_lentes);
    //console.log('health detalle:', health);

    // documentos
    //console.log('cv:', cv);
    //console.log('comprobante_estudios:', comprobante_estudios);
    //console.log('identificacion_oficial:', identificacion_oficial);
    //console.log('cedula_profesional:', cedula_profesional);
    //console.log('constancia_laboral:', constancia_laboral);
    //console.log('cartas_recomendacion:', cartas_recomendacion);
    //console.log('curp:', curp);
    //console.log('afore:', afore);
    //console.log('constancia_fiscal:', constancia_fiscal);
    //console.log('licencia_manejo:', licencia_manejo);
    //console.log('comprobante_domicilio:', comprobante_domicilio);
    //console.log('constancia_nss:', constancia_nss);
    //console.log('acta_nacimiento_candidato:', acta_nacimiento_candidato);
    //console.log('acta_matrimonio:', acta_matrimonio);
    //console.log('acta_nacimiento_hijos:', acta_nacimiento_hijos);
    //console.log('acta_nacimiento_conyuge:', acta_nacimiento_conyuge);

    // conclusiones
    //console.log('info_coincide_final:', info_coincide_final);
    //console.log('vivienda_corresponde:', vivienda_corresponde);
    //console.log('entorno_adecuado:', entorno_adecuado);
    //console.log('problemas_analisis:', problemas_analisis);
    //console.log('problemas_visita:', problemas_visita);
    //console.log('problemas_agenda:', problemas_agenda);
    //console.log('candidato_proporciono_toda_info:', candidato_proporciono_toda_info);
    //console.log('obtencion_info_dentro_domicilio:', obtencion_info_dentro_domicilio);
    //console.log('actitud_candidato:', actitud_candidato);

    /* -----------------------
       JSON completo
       ----------------------- */
    const formJSON = {
      meta: { generado_en: new Date().toISOString() },
      datos_generales: { correo, folio, fecha_solicitud, fecha_visita, puesto, url_fotografia_upload },
      empresa_valuadora: { valuador_nombre},
      empresa_solicitante: { solicitante_razon2, solicitante_contacto, solicitante_email },
      candidato: { candidato_nombre, edad, fecha_nacimiento, rfc, telefono, telefono_recados, lugar_nacimiento, estado, pais, estado_civil, num_hijos, direccion, colonia, ciudad, codigo_postal, familia_empresa, nombre_familiar },
      croquis: url_croquis_upload,
      fotos_domicilio: { url_ext_upload, url_int_upload, url_sala_upload, url_docs_upload },
      familiares: familiares,
      situacion_economica: {
        estilo_vida: { sueldo_actual, ingresos_negocio, ingresos_oficio, otros_ingresos },
        ingresos_familiares: { ingresos_conyuge, ingresos_padres, ingresos_hijos, ingresos_hermanos, otros_ingresos_familiares },
        gastos_traslado: { gasto_pasajes, gasto_taxi, gasto_gasolina, gasto_casetas },
        egresos_mensuales_candidato: {
          gasto_alimentacion, gasto_agua_potable, gasto_luz, gasto_internet, gasto_telefonia, gasto_streaming, gasto_mantenimiento_hogar,
          gasto_mantenimiento_vehicular, gasto_pension_alimenticia, gasto_salidas_recreativas,
          gasto_membresias, gasto_seguros_vida, gasto_seguro_vehiculo, gasto_credito_vivienda,
          gasto_credito_vehicular, gasto_hipoteca, gasto_mascotas, gasto_consultas_medicas,
          gasto_educacion, gasto_ropa_calzado
        }
      },
      comodidades: {
        tiene_vehiculo, veh_marca, veh_modelo, veh_ano, veh_color,
        cuenta_computadora, cuenta_bicicleta, cuenta_tablet, cuenta_refri,  cuenta_tv, cuenta_microondas,
        cuenta_estufa, cuenta_lavadora, cuenta_motocicleta,
        motocicleta: { moto_marca, moto_modelo, moto_ano, moto_color },
        aparatos: { cuenta_camara, cuenta_freidora, cuenta_horno_electrico, cuenta_batidora, cuenta_tostador, cuenta_dispensador, cuenta_licuadora, cuenta_tanque_gas, cuenta_celular },
        celular: { cel_marca, cel_modelo },
        hogar: { cuenta_cama, cuenta_sala, cuenta_cocina_integral, cuenta_closet, cuenta_banio, cuenta_calentador_solar, cuenta_calentador_boiler, cuenta_panel_solar }
      },
      servicios_zona: {
        agua_potable, energia_electrica, drenaje, pavimentacion, alumbrado_publico, lineas_telefonicas, lineas_internet, lineas_gas, lineas_cable, escuelas, hospitales, centros_comerciales, club_social_colonia, parques_recreativos, recoleccion_residuos, transporte_publico, cuenta_metro, cuenta_teleferico
      },
      academicos: { ultimo_nivel, institucion, entidad_federativa, documento_recibido, estudia_actualmente, que_estudia, cursos },
      investigacion_laboral: empresas,
      referencias: { personales: refs_personales, laborales: refs_laborales, vecinal: refs_vecinal, familiar: refs_familiar },
      salud: { nss, tipo_sangre, estatura, peso, utiliza_lentes, justificacion_lentes, detalles: health },
      contactos_emergencia: contactos_emergencia,
      documentos: { url_cv_upload, url_comprobante_upload, url_ine_upload, url_cedula_upload, url_constancia_upload, url_cartas_upload, url_curp_upload, url_afore_upload, url_fiscal_upload, url_licencia_upload, url_domicilio_upload, url_nss_upload, url_nacimiento_upload, url_matrimonio_upload, url_actahijo_upload, url_actaconyuge_upload },
      conclusiones: { info_coincide_final, vivienda_corresponde, entorno_adecuado, problemas_analisis, problemas_visita, problemas_agenda, candidato_proporciono_toda_info, obtencion_info_dentro_domicilio, actitud_candidato },
      identificadores: {USER_PROGRESS, USER_ID}
    };

    const niveles = [];
    document.querySelectorAll('#niveles-wrap > div').forEach(w => {
    const idSuffix = w.id.split('_').pop();
    niveles.push({
        ultimo_nivel: document.getElementById(`ultimo_nivel_${idSuffix}`) ? document.getElementById(`ultimo_nivel_${idSuffix}`).value : '',
        institucion: document.getElementById(`institucion_${idSuffix}`) ? document.getElementById(`institucion_${idSuffix}`).value : '',
        entidad_federativa: document.getElementById(`entidad_federativa_${idSuffix}`) ? document.getElementById(`entidad_federativa_${idSuffix}`).value : '',
        documento_recibido: document.getElementById(`documento_recibido_${idSuffix}`) ? document.getElementById(`documento_recibido_${idSuffix}`).value : ''
    });
    });
    formJSON.academicos = formJSON.academicos || {};
    formJSON.academicos.niveles = niveles;


    //console.log('formJSON:', JSON.stringify(formJSON, null, 2));

    //alert('Formulario procesado. Revisa la consola para ver variables individuales y el JSON completo.');

    
    

    //console.log("Aplicante ", USER_ID);
    //console.log("ID PROGRESO ", USER_PROGRESS);
    //console.log("Loggeado ", userId);
    //console.log("Token ", token_a);

    const bodyForm = {
        applicant_id: USER_ID,
        form_object: formJSON
    };

    try {

        const response = axios.post(`${API_URL}form`, bodyForm, {
          headers: {
            Authorization: `Bearer ${token_a}`,
            "Content-Type": "application/json",
          },
        });
      // 📌 Actualizar progreso SOLO si la subida fue exitosa
          const body2 = { documenting_information: true, visit_complete: true };
          const resProgress =  axios.patch(
            `${API_URL}user-progress/${usuarioSeleccionado._id}`,
            body2,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        mostrarModalMensajeForm("✅ Formulario guardado");

        setTimeout(() => {
            window.location.replace("estudiosProceso.html");
        }, 5000);

      } catch (err) {
        mostrarModalMensajeForm(
          "❌ Error al guardar el form: " +
            (err.response?.data?.message || err.message)
        );
      }

  });

document.addEventListener('DOMContentLoaded', function() {
  const sections = Array.from(document.querySelectorAll('.salav-card'));
  if (!sections.length) return;

  let current = 0;
  sections.forEach((s, i) => { s.classList.toggle('active', i === 0); });

const dotsContainer = document.getElementById('sectionDots');
dotsContainer.innerHTML = '';

sections.forEach((_, i) => {
  const dot = document.createElement('div');                       
  dot.className = 'section-dot' + (i === 0 ? ' active' : '');
  dot.dataset.section = i;                                         
  dot.title = `Ir a sección ${i + 1}`;
  dot.setAttribute('role', 'button');                             
  dot.tabIndex = 0;

  dot.addEventListener('click', () => goTo(i));
  dot.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goTo(i);
    }
  });

  dotsContainer.appendChild(dot);
});


  // progress UI
  const progressFill = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');
  const progressPercent = document.getElementById('progressPercent');
  function updateProgress() {
    const total = sections.length;
    const pct = Math.round(((current + 1) / total) * 100);
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressLabel) progressLabel.textContent = `Sección ${current + 1} / ${total}`;
    if (progressPercent) progressPercent.textContent = `${pct}%`;
    
    Array.from(document.querySelectorAll('.section-dot')).forEach((d, idx) => {
      d.classList.toggle('active', idx === current);
      d.classList.toggle('completed', idx < current);
    });
  }
  
  updateProgress();

  
  let nav = document.querySelector('.navigation');
  if (!nav) {
    nav = document.createElement('div');
    nav.className = 'navigation';
    
    const form = document.getElementById('salav-form');
    form.appendChild(nav);
  }


  if (!nav.querySelector('.btn-prev')) {
    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'btn btn-prev';
    prev.textContent = 'Anterior';
    prev.addEventListener('click', () => goTo(current - 1));
    nav.appendChild(prev);
  }
  if (!nav.querySelector('.btn-next')) {
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'btn btn-next';
    next.textContent = 'Siguiente';
    next.addEventListener('click', () => goTo(current + 1));
    nav.appendChild(next);
  }
  if (!nav.querySelector('.btn-submit')) {
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'btn btn-submit';
    submit.textContent = 'Enviar formulario';
   
    nav.appendChild(submit);
  }

 
  const btnPrev = nav.querySelector('.btn-prev');
  const btnNext = nav.querySelector('.btn-next');
  const btnSubmit = nav.querySelector('.btn-submit');

  function goTo(index) {
    const total = sections.length;
    if (index < 0) index = 0;
    if (index > total - 1) index = total - 1;
    current = index;
    sections.forEach((s, i) => s.classList.toggle('active', i === current));
    updateProgress();
   
    const active = sections[current];
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'start' });

  
    if (btnPrev) btnPrev.style.visibility = (current === 0) ? 'hidden' : 'visible';
    if (btnNext) btnNext.style.display = (current === total - 1) ? 'none' : 'inline-flex';
    if (btnSubmit) btnSubmit.style.display = (current === total - 1) ? 'inline-flex' : 'none';
  }

  goTo(0);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
  });

  
document.querySelectorAll('form button[type="submit"]').forEach(btn => {
  if (!btn.closest('.navigation')) btn.remove();
});

// Asegúrate de que el submit del nav solo se vea en la última sección:
if (btnSubmit) btnSubmit.style.display = 'none';
function refreshNavVisibility() {
  const total = sections.length;
  btnPrev.style.visibility = (current === 0) ? 'hidden' : 'visible';
  btnNext.style.display = (current === total - 1) ? 'none' : 'inline-flex';
  btnSubmit.style.display = (current === total - 1) ? 'inline-flex' : 'none';
}
});

// Manejar carga de archivos
const MAX_MB = 3; // <--- tamaño máximo en MB (ajusta aquí)
const MAX_BYTES = MAX_MB * 1024 * 1024;

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = 2;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/*
  const fileUploads = document.querySelectorAll('.file-upload');
  fileUploads.forEach(upload => {
    const input = upload.querySelector('input');
    const fileName = upload.nextElementSibling;

    upload.addEventListener('click', () => input.click());

    input.addEventListener('change', () => {
      if (!input.files || input.files.length === 0) {
        fileName.textContent = '';
        return;
      }

      const files = Array.from(input.files);
      const oversize = files.filter(f => f.size > MAX_BYTES);

      if (oversize.length > 0) {
        // Mensaje al usuario: puedes cambiar alert por un toast o un <span> en el DOM
        const listNames = oversize.map(f => `${f.name} (${formatBytes(f.size)})`).join(', ');
        //alert(`El/los archivo(s) ${listNames} excede(n) el tamaño máximo de ${MAX_MB} MB.`);
        mostrarModalMensajeForm(`El archivo ${listNames} debe pesar menos de  ${MAX_MB} MB. ❌`);
        // limpiar el input para evitar subirlo accidentalmente
        input.value = '';
        fileName.textContent = '';
        // opcional: deshabilitar el botón de enviar
        const form = upload.closest('form');
        if (form) {
          const submit = form.querySelector('[type="submit"]');
          if (submit) submit.disabled = true;
        }
        return;
      }

      // si todo ok:
      // - actualizar nombre / contador
      if (input.multiple) {
        fileName.textContent = `${files.length} archivos seleccionados`;
      } else {
        fileName.textContent = files[0].name;
      }
      // opcional: volver a habilitar submit si estaba deshabilitado
      const form = upload.closest('form');
      if (form) {
        const submit = form.querySelector('[type="submit"]');
        if (submit) submit.disabled = false;
      }
    });
  });
*/

const fileUploads = document.querySelectorAll('.file-upload');

fileUploads.forEach(upload => {
  const input = upload.querySelector('input');
  const fileName = upload.nextElementSibling;

  upload.addEventListener('click', () => input.click());

  input.addEventListener('change', async () => {
    if (!input.files || input.files.length === 0) {
      fileName.textContent = '';
      return;
    }

    const files = Array.from(input.files);
    const oversize = files.filter(f => f.size > MAX_BYTES);

    if (oversize.length > 0) {
      const listNames = oversize.map(f => `${f.name} (${formatBytes(f.size)})`).join(', ');
      mostrarModalMensajeForm(`El archivo ${listNames} debe pesar menos de ${MAX_MB} MB. ❌`);
      input.value = '';
      fileName.textContent = '';
      const form = upload.closest('form');
      if (form) {
        const submit = form.querySelector('[type="submit"]');
        if (submit) submit.disabled = true;
      }
      return;
    }

    if (input.multiple) {
      fileName.textContent = `${files.length} archivos seleccionados`;
    } else {
      fileName.textContent = files[0].name;
    }
    const form = upload.closest('form');
    if (form) {
      const submit = form.querySelector('[type="submit"]');
      if (submit) submit.disabled = false;
    }

    // Subida (primer archivo por defecto)
    const file = files[0];

    // construir carpeta dinámica
    const rawName = (typeof usuarioname === 'string') ? usuarioname.trim() : '';
    const nombres = rawName.split(/\s+/);
    const nombre = nombres[0] || '';
    const apellido = nombres[1] || '';
    const carpeta = (nombre.slice(0, 3) + apellido.slice(0, 2)) || 'SinNom';

    try {
      const formData = new FormData();
      formData.append("file", file);
      //formData.append("path", `${carpeta}/Form`);
      formData.append("path", `${numerosolicitud}_${carpeta}/Form`);

      //console.log(`${numerosolicitud}_${carpeta}/Form`);

      const res = await axios.post(`${API_URL}google/upload`, formData, {
        headers: { Authorization: `Bearer ${token_a}` }
      });

      const lastUploadResponse = res.data;
      const fileId = lastUploadResponse && lastUploadResponse.id;

      if (!fileId) {
        console.error('Respuesta de upload no contiene id:', lastUploadResponse);
        mostrarModalMensajeForm('Error al subir el archivo: respuesta inválida del servidor. ❌');
        return;
      }

      const url = `https://drive.google.com/file/d/${fileId}/view`;

      // sanitizar upload.id: reemplazar "-" por "_" y eliminar espacios
      const safeUploadId = String(upload.id || '')
        .replace(/-/g, '_')
        .replace(/\s+/g, '_');

      setUploadUrl(safeUploadId, url);

      //console.log('safeUploadId ->', safeUploadId);
      //console.log('Asignada URL ->', url);

    } catch (err) {
      console.error('Error subiendo archivo:', err);
      mostrarModalMensajeForm('Error al subir el archivo. Revisa la consola para más detalles. ❌');
    }
  });
});



/*
Autosave & restore form (vanilla JS)
- Guarda entradas en localStorage (debounced).
- Maneja checkboxes, radios, selects, textareas, inputs type=text/email/number/date.
- Maneja 1 archivo llamado "fotografia" usando IndexedDB (mejor) y muestra preview.
- Limpia el draft al hacer submit exitoso.
- Sincroniza entre pestañas con BroadcastChannel.
*/

(() => {
  // --- Obtener userId (querystring o sessionStorage) y form slug ---
  

  //console.log(USER_ID);
  //console.log(USER_PROGRESS);
  // --- Claves dinámicas por usuario+form ---
  const FORM_ID = 'salav-form';
  const STORAGE_KEY = `salav:form:draft:v1:${USER_ID}:${FORM_SLUG}`;
  const FILE_DB = 'salav-files';
  const FILE_STORE = 'files';
  const FILE_KEY = `salav:file:${USER_ID}:${FORM_SLUG}:fotografia`; // key to store the blob in IndexedDB
  const AUTOSAVE_DELAY = 600; // ms debounce

  const form = document.getElementById(FORM_ID);
  if (!form) return;

  // --- IndexedDB helpers (vanilla minimal) ---
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(FILE_DB, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(FILE_STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbPut(key, value) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FILE_STORE, 'readwrite');
      tx.objectStore(FILE_STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function idbGet(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FILE_STORE, 'readonly');
      const req = tx.objectStore(FILE_STORE).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbDelete(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FILE_STORE, 'readwrite');
      tx.objectStore(FILE_STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- util debounce ---
  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  // --- serialize form values (no files) ---
  function serializeForm(formEl) {
    const data = {};
    const elements = Array.from(formEl.elements).filter(el => el.name && !el.disabled);
    for (const el of elements) {
      if (el.type === 'file') continue; // files handled separately
      if (el.type === 'checkbox') {
        if (!data[el.name]) data[el.name] = el.checked;
        else data[el.name] = el.checked; // override single checkbox (or keep last state)
      } else if (el.type === 'radio') {
        if (el.checked) data[el.name] = el.value;
      } else {
        data[el.name] = el.value;
      }
    }
    data.__savedAt = new Date().toISOString();
    return data;
  }

  // --- restore form values ---
  async function restoreForm() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      const elements = Array.from(form.elements).filter(el => el.name);
      for (const el of elements) {
        if (el.type === 'file') continue;
        if (el.type === 'checkbox') {
          if (data.hasOwnProperty(el.name)) el.checked = Boolean(data[el.name]);
        } else if (el.type === 'radio') {
          if (data[el.name] !== undefined) el.checked = (el.value === data[el.name]);
        } else {
          if (data[el.name] !== undefined) el.value = data[el.name];
        }
      }

      // restore fotografia preview from IndexedDB if exists
      const blob = await idbGet(FILE_KEY).catch(() => null);
      if (blob) populateFilePreview(blob);
    } catch (e) {
      console.warn('restoreForm error', e);
    }
  }

  // --- save to localStorage (and optionally file to idb) ---
  const saveDraft = debounce(async () => {
    try {
      const data = serializeForm(form);
      const hasFile = await idbGet(FILE_KEY).then(r => !!r).catch(() => false);
      data.__hasFile = hasFile;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      broadcastDraftSaved();
    } catch (e) {
      console.warn('saveDraft error', e);
    }
  }, AUTOSAVE_DELAY);

  // --- file input handling ---
  const fileInput = form.querySelector('input[type="file"][name="fotografia"]');
  const fileNameDiv = document.getElementById('fotografia-name');

  function populateFilePreview(blob) {
    if (!blob) {
      if (fileNameDiv) fileNameDiv.textContent = '';
      return;
    }
    const url = URL.createObjectURL(blob);
    if (fileNameDiv) {
      const img = document.createElement('img');
      img.src = url;
      img.style.maxWidth = '120px';
      img.style.maxHeight = '120px';
      img.style.display = 'block';
      img.style.marginTop = '6px';
      fileNameDiv.innerHTML = '';
      fileNameDiv.appendChild(img);
    }
  }

  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const f = e.target.files[0];
      if (!f) {
        // user cleared the input -> remove stored file and name
        await idbDelete(FILE_KEY).catch(()=>{});
        localStorage.removeItem(`${STORAGE_KEY}:fotografia:name`);
        saveDraft();
        populateFilePreview(null);
        return;
      }
      try {
        // store the blob in IndexedDB
        await idbPut(FILE_KEY, f);
        // store filename in localStorage (so we can re-append on submit)
        localStorage.setItem(`${STORAGE_KEY}:fotografia:name`, f.name);
        if (fileNameDiv) fileNameDiv.textContent = f.name;
        populateFilePreview(f);
      } catch (err) {
        console.warn('Error saving file to idb', err);
        // fallback: try storing small base64 in localStorage (not recommended)
        const dataUrl = await readFileAsDataURL(f);
        try {
          localStorage.setItem(`${STORAGE_KEY}:fotografia:dataurl`, dataUrl);
          localStorage.setItem(`${STORAGE_KEY}:fotografia:name`, f.name);
          if (fileNameDiv) fileNameDiv.textContent = f.name + ' (guardada en localStorage)';
          const img = document.createElement('img');
          img.src = dataUrl;
          img.style.maxWidth = '120px';
          img.style.maxHeight = '120px';
          fileNameDiv.innerHTML = '';
          fileNameDiv.appendChild(img);
        } catch (e) {
          console.error('No se pudo guardar la foto en localStorage (posible límite de tamaño).', e);
        }
      } finally {
        saveDraft();
      }
    });
  }

  function readFileAsDataURL(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = () => rej(fr.error);
      fr.readAsDataURL(file);
    });
  }

  

  // If a dataURL fallback exists (from earlier fallback), restore it
  async function restoreFileFallbackIfAny() {
    const dataUrl = localStorage.getItem(`${STORAGE_KEY}:fotografia:dataurl`);
    if (dataUrl) {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      populateFilePreview(blob);
    }
  }

  // --- wire input events ---
  const watchSelector = 'input:not([type=file]), textarea, select, input[type=checkbox], input[type=radio]';
  form.querySelectorAll(watchSelector).forEach(el => {
    el.addEventListener('input', saveDraft);
    el.addEventListener('change', saveDraft);
  });

  // save on beforeunload as last resort
  window.addEventListener('beforeunload', saveDraft);

  // restore on load
  document.addEventListener('DOMContentLoaded', async () => {
    await restoreForm();
    await restoreFileFallbackIfAny();
  });

  // on successful submit: clear draft
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const currentFile = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0] : null;
    if (!currentFile) {
      const blob = await idbGet(FILE_KEY).catch(() => null);
      if (blob) {
        const storedName = localStorage.getItem(`${STORAGE_KEY}:fotografia:name`) || 'fotografia.jpg';
        formData.append('fotografia', blob, storedName);
      } else {
        // if we only have dataurl fallback, try to use it
        const dataUrl = localStorage.getItem(`${STORAGE_KEY}:fotografia:dataurl`);
        if (dataUrl) {
          const res = await fetch(dataUrl);
          const blobFromDataUrl = await res.blob();
          const storedName = localStorage.getItem(`${STORAGE_KEY}:fotografia:name`) || 'fotografia.jpg';
          formData.append('fotografia', blobFromDataUrl, storedName);
        }
      }
    }

    // TODO: reemplaza la siguiente parte por tu fetch/ajax real a tu endpoint.
    // Ejemplo:
    // const resp = await fetch('/tu-endpoint', { method: 'POST', body: formData });
    // if (resp.ok) clearDraft();

    //console.log('Formulario listo para enviar; FormData preparado. (Simulación)');
    clearDraft();
  });

  // --- clear draft ---
  async function clearDraft() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}:fotografia:dataurl`);
    localStorage.removeItem(`${STORAGE_KEY}:fotografia:name`);
    try { await idbDelete(FILE_KEY); } catch(_) {}
    broadcastDraftCleared();
    if (fileNameDiv) fileNameDiv.textContent = '';
    //console.log('Draft cleared');
  }

  // --- BroadcastChannel to sync tabs (channel scoped per user+form) ---
  const bcName = `salav-draft:${USER_ID}:${FORM_SLUG}`;
  const bc = ('BroadcastChannel' in window) ? new BroadcastChannel(bcName) : null;
  function broadcastDraftSaved() { if (!bc) return; bc.postMessage({ type: 'saved', ts: Date.now() }); }
  function broadcastDraftCleared() { if (!bc) return; bc.postMessage({ type: 'cleared', ts: Date.now() }); }
  if (bc) {
    bc.onmessage = (ev) => {
      if (!ev.data) return;
      if (ev.data.type === 'saved') {
        // podrías mostrar un pequeño aviso "Borrador guardado en otra pestaña"
      } else if (ev.data.type === 'cleared') {
        // si borraron en otra pestaña, actualiza UI
        // por simplicidad llamamos a restoreForm para refrescar estado
        restoreForm();
      }
    };
  }

  // expose small API for debugging
  window._SALAV_DRAFT = {
    saveDraft,
    restoreForm,
    clearDraft,
    idbGet,
    idbPut,
    STORAGE_KEY,
    FILE_KEY,
    USER_ID,
    FORM_SLUG,
  };

  

async function fetchUserProgress() {
    try {
      const res = await axios.get(`${API_URL}user-progress`, {
        headers: {
          Authorization: `Bearer ${token_a}`,
        },
        params: {
          freelance_id: userId,
          application_accepted: true, 
        },
      });

      usuarios = res.data; // Actualiza la variable global con los datos recibidos
      // //console.log("User Progress:", usuarios);
      filteredUsuarios = [...usuarios];
      renderSolicitudes(); // Llama a la función para renderizar la tabla con los nuevos datos
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // mostrarModalMensaje("❌ Sesión expirada. Inicia sesión de nuevo.");
        // errorServer();
      } else {
        // mostrarModalMensaje("❌ Error al obtener el progreso de usuarios.");
        // errorServer();
      }
    }
  }

  

})();
