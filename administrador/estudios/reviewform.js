import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib";

import axios from "https://cdn.skypack.dev/axios";

// Variables globales
const urlParams = new URLSearchParams(window.location.search);
const USER_ID = urlParams.get('user') || sessionStorage.getItem('salav:currentUserId') || 'anonymous_user';
const USER_PROGRESS = urlParams.get('userprogress') || sessionStorage.getItem('salav:currentUserId') || 'anonymous_user';
const formEl = document.getElementById('salav-form');
const FORM_SLUG = (formEl && formEl.getAttribute('data-form')) ? formEl.getAttribute('data-form') : 'estudio_socioeconomico';
var token_a = localStorage.getItem("access_token");
var id_form = null;
const usuarioname = sessionStorage.getItem('nombre_seleccionado');
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

// Variables para secciones dinámicas
const familiaresWrap = document.getElementById('familiares-wrap');
let familiarCount = 0;
let cursoCount = 0;
let empresaCount = 0;



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

/* -----------------------
   FUNCIONES PARA OBTENER Y PRELLENAR DATOS
   ----------------------- */

function prefillFileThumbnails(formObject) {
    if (!formObject) return;

    // Datos generales - Fotografía
    if (formObject.datos_generales && formObject.datos_generales.url_fotografia_upload) {
        showExistingThumbnail(
            formObject.datos_generales.url_fotografia_upload,
            'fotografia_thumbnail',
            'Fotografía'
        );
    }

    // Croquis
    if (formObject.croquis) {
        showExistingThumbnail(formObject.croquis, 'croquis_thumbnail', 'Croquis');
    }

    // Fotos domicilio
    if (formObject.fotos_domicilio) {
        if (formObject.fotos_domicilio.url_ext_upload) {
            showExistingThumbnail(formObject.fotos_domicilio.url_ext_upload, 'foto_fachada_exterior_thumbnail', 'Fachada exterior');
        }
        if (formObject.fotos_domicilio.url_int_upload) {
            showExistingThumbnail(formObject.fotos_domicilio.url_int_upload, 'foto_fachada_interior_thumbnail', 'Fachada interior');
        }
        if (formObject.fotos_domicilio.url_sala_upload) {
            showExistingThumbnail(formObject.fotos_domicilio.url_sala_upload, 'foto_sala_thumbnail', 'Sala');
        }
        if (formObject.fotos_domicilio.url_docs_upload) {
            showExistingThumbnail(formObject.fotos_domicilio.url_docs_upload, 'foto_entregando_documentos_thumbnail', 'Entrega de documentos');
        }
    }

    // Documentos
    if (formObject.documentos) {
        const docs = formObject.documentos;
        if (docs.url_cv_upload) showExistingThumbnail(docs.url_cv_upload, 'cv_thumbnail', 'CV');
        if (docs.url_ine_upload) showExistingThumbnail(docs.url_ine_upload, 'identificacion_oficial_thumbnail', 'INE');
        if (docs.url_nss_upload) showExistingThumbnail(docs.url_nss_upload, 'constancia_nss_thumbnail', 'NSS');
        if (docs.url_curp_upload) showExistingThumbnail(docs.url_curp_upload, 'curp_thumbnail', 'CURP');
        if (docs.url_afore_upload) showExistingThumbnail(docs.url_afore_upload, 'afore_thumbnail', 'AFORE');
        if (docs.url_cartas_upload) showExistingThumbnail(docs.url_cartas_upload, 'cartas_recomendacion_thumbnail', 'Cartas recomendación');
        if (docs.url_cedula_upload) showExistingThumbnail(docs.url_cedula_upload, 'cedula_profesional_thumbnail', 'Cédula profesional');
        if (docs.url_fiscal_upload) showExistingThumbnail(docs.url_fiscal_upload, 'constancia_fiscal_thumbnail', 'Constancia fiscal');
        if (docs.url_actahijo_upload) showExistingThumbnail(docs.url_actahijo_upload, 'acta_nacimiento_hijos_thumbnail', 'Acta hijos');
        if (docs.url_licencia_upload) showExistingThumbnail(docs.url_licencia_upload, 'licencia_manejo_thumbnail', 'Licencia manejo');
        if (docs.url_domicilio_upload) showExistingThumbnail(docs.url_domicilio_upload, 'comprobante_domicilio_thumbnail', 'Comprobante domicilio');
        if (docs.url_constancia_upload) showExistingThumbnail(docs.url_constancia_upload, 'constancia_laboral_thumbnail', 'Constancia laboral');
        if (docs.url_matrimonio_upload) showExistingThumbnail(docs.url_matrimonio_upload, 'acta_matrimonio_thumbnail', 'Acta matrimonio');
        if (docs.url_nacimiento_upload) showExistingThumbnail(docs.url_nacimiento_upload, 'acta_nacimiento_candidato_thumbnail', 'Acta nacimiento');
        if (docs.url_comprobante_upload) showExistingThumbnail(docs.url_comprobante_upload, 'comprobante_estudios_thumbnail', 'Comprobante estudios');
        if (docs.url_actaconyuge_upload) showExistingThumbnail(docs.url_actaconyuge_upload, 'acta_nacimiento_conyuge_thumbnail', 'Acta nacimiento conyuge');
    }

    //Pre llenar variables

    url_fotografia_upload = formObject.datos_generales.url_fotografia_upload;
    url_croquis_upload = formObject.croquis;
    url_ext_upload = formObject.croquis;
    url_int_upload = formObject.fotos_domicilio.url_int_upload;
    url_sala_upload = formObject.fotos_domicilio.url_sala_upload;
    url_docs_upload = formObject.fotos_domicilio.url_docs_upload;
    url_cv_upload = formObject.documentos.url_cv_upload;
    url_comprobante_upload = formObject.documentos.url_comprobante_upload;
    url_ine_upload = formObject.documentos.url_ine_upload;
    url_cedula_upload = formObject.documentos.url_cedula_upload;
    url_constancia_upload = formObject.documentos.url_constancia_upload;
    url_cartas_upload = formObject.documentos.url_cartas_upload;
    url_curp_upload = formObject.documentos.url_curp_upload;
    url_afore_upload = formObject.documentos.url_afore_upload;
    url_fiscal_upload = formObject.documentos.url_fiscal_upload;
    url_licencia_upload = formObject.documentos.url_licencia_upload;
    url_domicilio_upload = formObject.documentos.url_domicilio_upload;
    url_nss_upload = formObject.documentos.url_nss_upload;
    url_nacimiento_upload = formObject.documentos.url_nacimiento_upload;
    url_matrimonio_upload = formObject.documentos.url_matrimonio_upload;
    url_actahijo_upload = formObject.documentos.url_actahijo_upload;
    url_actaconyuge_upload = formObject.documentos.url_actaconyuge_upload;

}

// Agregar esta función auxiliar para mostrar miniaturas existentes
function showExistingThumbnail(url, containerId, fileName) {
    const container = document.getElementById(containerId);
    if (!container || !url) return;

    // Crear contenedor si no existe
    if (!container) {
        const newContainer = document.createElement('div');
        newContainer.id = containerId;
        newContainer.style.marginTop = '5px';
        // Buscar el input correspondiente y insertar después
        const inputId = containerId.replace('_thumbnail', '');
        const input = document.getElementById(inputId);
        if (input && input.parentNode) {
            input.parentNode.insertBefore(newContainer, input.nextSibling);
        }
    }

    container.innerHTML = '';

    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url) ||
        url.includes('drive.google.com') && url.includes('/view');

    if (isImage) {
        let previewUrl = url.replace(/\/view(?:\?.*)?$/, '/preview');


        // crear el thumb (iframe pequeño)
        const wrapper = document.createElement('div');
        wrapper.className = 'drive-thumb';
        wrapper.setAttribute('role', 'button');
        wrapper.setAttribute('tabindex', '0');
        wrapper.setAttribute('aria-label', `Abrir vista previa: ${fileName || 'Imagen'}`);

        const thumbIframe = document.createElement('iframe');
        thumbIframe.src = previewUrl;
        thumbIframe.title = fileName || 'Preview';
        thumbIframe.loading = 'lazy';

        // etiqueta en la parte inferior
        const label = document.createElement('div');
        label.className = 'thumb-label';
        label.textContent = fileName || 'Imagen';

        // overlay transparente que captura clics en toda la superficie del thumb
        const overlay = document.createElement('div');
        overlay.className = 'thumb-overlay';
        overlay.setAttribute('role', 'button');
        overlay.setAttribute('tabindex', '0');
        overlay.setAttribute('aria-label', `Abrir vista previa: ${fileName || 'Imagen'}`);



        // ensamblar
        wrapper.appendChild(thumbIframe);
        wrapper.appendChild(label);
        wrapper.appendChild(overlay);

        // abrir modal con iframe grande
        function openDriveModal() {
            if (document.querySelector('.drive-modal')) return; // ya está abierto
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            const modal = document.createElement('div');
            modal.className = 'drive-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');

            const content = document.createElement('div');
            content.className = 'modal-content';

            const bigIframe = document.createElement('iframe');
            bigIframe.className = 'modal-iframe';
            bigIframe.src = previewUrl;
            bigIframe.title = fileName || 'Vista previa';
            bigIframe.allowFullscreen = true;

            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-btn';
            closeBtn.innerHTML = '✕';
            closeBtn.setAttribute('aria-label', 'Cerrar vista previa');

            function closeModal() {
                document.body.style.overflow = prevOverflow || '';
                window.removeEventListener('keydown', onKeyDown);
                modal.remove();
            }
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

            function onKeyDown(e) {
                if (e.key === 'Escape') closeModal();
            }
            window.addEventListener('keydown', onKeyDown);

            content.appendChild(closeBtn);
            content.appendChild(bigIframe);
            modal.appendChild(content);
            document.body.appendChild(modal);

            // focus accesible
            closeBtn.focus();
        }

        // abrir por click o teclado (Enter / Space) — overlay captura clics en todo el frame
        overlay.addEventListener('click', openDriveModal);
        overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openDriveModal();
            }
        });

        // también permitir abrir con Enter/Space sobre el wrapper
        wrapper.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openDriveModal();
            }
        });

        // añadir al contenedor
        container.appendChild(wrapper);


        // Agregar botón para eliminar
        /*
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.style.background = '#ff4444';
        removeBtn.style.color = 'white';
        removeBtn.style.border = 'none';
        removeBtn.style.borderRadius = '50%';
        removeBtn.style.width = '25px';
        removeBtn.style.height = '25px';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.marginLeft = '5px';
        removeBtn.title = 'Eliminar archivo';
        
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            container.innerHTML = '';
            // También limpiar el input file si existe
            const inputId = containerId.replace('_thumbnail', '');
            const input = document.getElementById(inputId);
            if (input) input.value = '';
        });
        
        container.appendChild(removeBtn);*/
    } else {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.innerHTML = '📄 ' + (fileName || 'Ver archivo');
        link.style.display = 'inline-block';
        link.style.padding = '5px';
        link.style.textDecoration = 'none';
        link.style.color = '#007bff';
        link.style.border = '1px solid #ddd';
        link.style.borderRadius = '4px';
        link.style.margin = '5px';
        container.appendChild(link);

        // Botón eliminar para archivos no imagen
        /*
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.style.background = '#ff4444';
        removeBtn.style.color = 'white';
        removeBtn.style.border = 'none';
        removeBtn.style.borderRadius = '50%';
        removeBtn.style.width = '25px';
        removeBtn.style.height = '25px';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.marginLeft = '5px';
        removeBtn.title = 'Eliminar archivo';
        
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            container.innerHTML = '';
            const inputId = containerId.replace('_thumbnail', '');
            const input = document.getElementById(inputId);
            if (input) input.value = '';
        });
        
        container.appendChild(removeBtn);*/
    }
}

// Función para obtener los datos del formulario desde el API
async function fetchFormData() {
    try {
        const response = await axios.get(`${API_URL}form?applicant_id=${USER_ID}`, {
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token_a}`
            }
        });

        // La respuesta es un array, tomamos el primer elemento
        if (response.data && response.data.length > 0) {
            return response.data[0];
        }
        return null;
    } catch (error) {
        console.error('Error fetching form data:', error);
        mostrarModalMensajeForm('Error al cargar los datos del formulario.');
        return null;
    }
}

// Función helper para setear valores
function setValue(elementId, value) {
    if (value === null || value === undefined) return;

    const element = document.getElementById(elementId);
    if (element) {
        element.value = value;
    }
}

// Función helper para setear radio buttons
function setRadioValue(name, value) {
    if (!value) return;

    const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (radio) {
        radio.checked = true;
        // Disparar evento change para mostrar/ocultar secciones condicionales
        setTimeout(() => {
            radio.dispatchEvent(new Event('change'));
        }, 100);
    }
}

// Función helper para setear selects
function setSelectValue(elementId, value) {
    if (!value) return;

    const element = document.getElementById(elementId);
    if (element) {
        element.value = value;
    }
}

// Función principal para prellenar el formulario
async function prefillForm() {
    const formData = await fetchFormData();
    if (!formData) {
        //console.log('No se encontraron datos para prellenar');
        return;
    }

    const formObject = formData.form_object;
    //console.log('Datos del formulario a prellenar:', formObject);
    id_form = formData._id;

    // Prellenar secciones en orden
    prefillGeneralData(formObject);
    prefillCandidateData(formObject.candidato);
    prefillHealthData(formObject.salud);
    prefillAcademicData(formObject.academicos);
    prefillEconomicData(formObject.situacion_economica);
    prefillComfortsData(formObject.comodidades);
    prefillServicesData(formObject.servicios_zona);
    prefillConclusionsData(formObject.conclusiones);
    prefillContactosEmergencia(formObject.contactos_emergencia);
    prefillFileThumbnails(formObject);

    // Activar secciones condicionales después de prellenar
    setTimeout(() => {
        activateConditionalSections();
    }, 400);


    // Prellenar secciones dinámicas (después de un breve delay para asegurar que el DOM esté listo)
    setTimeout(() => {
        prefillDynamicSections(formObject);
    }, 300);

    //console.log('Formulario prellenado exitosamente');
}

// Prellenar datos generales
function prefillGeneralData(data) {
    if (!data) return;

    if (data.datos_generales) {
        setValue('correo', data.datos_generales.correo);
        setValue('folio', data.datos_generales.folio);
        setValue('fecha_solicitud', data.datos_generales.fecha_solicitud);
        setValue('fecha_visita', data.datos_generales.fecha_visita);
        setValue('puesto', data.datos_generales.puesto);
    }

    if (data.empresa_valuadora) {
        setValue('valuador_nombre', data.empresa_valuadora.valuador_nombre);
    }

    if (data.empresa_solicitante) {
        setValue('solicitante_razon2', data.empresa_solicitante.solicitante_razon2);
        setValue('solicitante_contacto', data.empresa_solicitante.solicitante_contacto);
        setValue('solicitante_email', data.empresa_solicitante.solicitante_email);
    }
}

// Prellenar datos del candidato
function prefillCandidateData(candidato) {
    if (!candidato) return;

    setValue('candidato_nombre', candidato.candidato_nombre);
    setValue('edad', candidato.edad);
    setValue('fecha_nacimiento', candidato.fecha_nacimiento);
    setValue('rfc', candidato.rfc);
    setValue('telefono', candidato.telefono);
    setValue('telefono_recados', candidato.telefono_recados);
    setValue('lugar_nacimiento', candidato.lugar_nacimiento);
    setValue('estado', candidato.estado);
    setValue('pais', candidato.pais);
    setValue('estado_civil', candidato.estado_civil);
    setValue('num_hijos', candidato.num_hijos);
    setValue('direccion', candidato.direccion);
    setValue('colonia', candidato.colonia);
    setValue('ciudad', candidato.ciudad);
    setValue('codigo_postal', candidato.codigo_postal);
    setRadioValue('familia_empresa', candidato.familia_empresa);
    setValue('nombre_familiar', candidato.nombre_familiar);
}

// Prellenar datos de salud
function prefillHealthData(salud) {
    if (!salud) return;

    setValue('nss', salud.nss);
    setValue('tipo_sangre', salud.tipo_sangre);
    setValue('estatura', salud.estatura);
    setValue('peso', salud.peso);
    setRadioValue('utiliza_lentes', salud.utiliza_lentes);
    setValue('justificacion_lentes', salud.justificacion_lentes);

    // Prellenar detalles de salud
    if (salud.detalles) {
        const detalles = salud.detalles;
        Object.keys(detalles).forEach(key => {
            const value = detalles[key];
            if (key.includes('_just')) {
                setValue(key, value);
            } else {
                setRadioValue(key, value);
            }
        });
    }
}

// Prellenar datos académicos
function prefillAcademicData(academicos) {
    if (!academicos) return;

    setValue('ultimo_nivel', academicos.ultimo_nivel);
    setValue('institucion', academicos.institucion);
    setValue('entidad_federativa', academicos.entidad_federativa);
    setValue('documento_recibido', academicos.documento_recibido);
    setRadioValue('estudia_actualmente', academicos.estudia_actualmente);
    setValue('que_estudia', academicos.que_estudia);
}

// Prellenar situación económica
function prefillEconomicData(economica) {
    if (!economica) return;

    // Estilo de vida
    if (economica.estilo_vida) {
        setValue('sueldo_actual', economica.estilo_vida.sueldo_actual);
        setValue('ingresos_negocio', economica.estilo_vida.ingresos_negocio);
        setValue('ingresos_oficio', economica.estilo_vida.ingresos_oficio);
        setValue('otros_ingresos', economica.estilo_vida.otros_ingresos);
    }

    // Ingresos familiares
    if (economica.ingresos_familiares) {
        setValue('ingresos_conyuge', economica.ingresos_familiares.ingresos_conyuge);
        setValue('ingresos_padres', economica.ingresos_familiares.ingresos_padres);
        setValue('ingresos_hijos', economica.ingresos_familiares.ingresos_hijos);
        setValue('ingresos_hermanos', economica.ingresos_familiares.ingresos_hermanos);
        setValue('otros_ingresos_familiares', economica.ingresos_familiares.otros_ingresos_familiares);
    }

    // Gastos de traslado
    if (economica.gastos_traslado) {
        setValue('gasto_pasajes', economica.gastos_traslado.gasto_pasajes);
        setValue('gasto_taxi', economica.gastos_traslado.gasto_taxi);
        setValue('gasto_gasolina', economica.gastos_traslado.gasto_gasolina);
        setValue('gasto_casetas', economica.gastos_traslado.gasto_casetas);
    }

    // Egresos mensuales
    if (economica.egresos_mensuales_candidato) {
        const egresos = economica.egresos_mensuales_candidato;
        Object.keys(egresos).forEach(key => {
            setValue(key, egresos[key]);
        });
    }
}

//PrellenarContactos
function prefillContactosEmergencia(contactos) {
    if (!contactos) return;

    // Primer contacto
    if (contactos.contacto1) {
        setValue('emergencia1_nombre', contactos.contacto1.nombre);
        setValue('emergencia1_parentesco', contactos.contacto1.parentesco);
        setValue('emergencia1_telefono', contactos.contacto1.telefono);
    }

    // Segundo contacto
    if (contactos.contacto2) {
        setValue('emergencia2_nombre', contactos.contacto2.nombre);
        setValue('emergencia2_parentesco', contactos.contacto2.parentesco);
        setValue('emergencia2_telefono', contactos.contacto2.telefono);
    }
}


// Prellenar comodidades
function prefillComfortsData(comodidades) {
    if (!comodidades) return;

    setRadioValue('tiene_vehiculo', comodidades.tiene_vehiculo);
    setValue('veh_marca', comodidades.veh_marca);
    setValue('veh_modelo', comodidades.veh_modelo);
    setValue('veh_ano', comodidades.veh_ano);
    setValue('veh_color', comodidades.veh_color);

    setValue('cuenta_computadora', comodidades.cuenta_computadora);
    setValue('cuenta_bicicleta', comodidades.cuenta_bicicleta);
    setValue('cuenta_tablet', comodidades.cuenta_tablet);
    setValue('cuenta_refri', comodidades.cuenta_refri);
    setValue('cuenta_tv', comodidades.cuenta_tv);
    setValue('cuenta_microondas', comodidades.cuenta_microondas);
    setValue('cuenta_estufa', comodidades.cuenta_estufa);
    setValue('cuenta_lavadora', comodidades.cuenta_lavadora);
    setValue('cuenta_motocicleta', comodidades.cuenta_motocicleta);

    // Motocicleta
    if (comodidades.motocicleta) {
        setValue('moto_marca', comodidades.motocicleta.moto_marca);
        setValue('moto_modelo', comodidades.motocicleta.moto_modelo);
        setValue('moto_ano', comodidades.motocicleta.moto_ano);
        setValue('moto_color', comodidades.motocicleta.moto_color);
    }

    // Aparatos
    if (comodidades.aparatos) {
        const aparatos = comodidades.aparatos;
        Object.keys(aparatos).forEach(key => {
            setValue(key, aparatos[key]);
        });
    }

    // Celular
    if (comodidades.celular) {
        setValue('cel_marca', comodidades.celular.cel_marca);
        setValue('cel_modelo', comodidades.celular.cel_modelo);
    }

    // Hogar
    if (comodidades.hogar) {
        const hogar = comodidades.hogar;
        Object.keys(hogar).forEach(key => {
            setValue(key, hogar[key]);
        });
    }
}

// Prellenar servicios de zona
function prefillServicesData(servicios) {
    if (!servicios) return;

    Object.keys(servicios).forEach(key => {
        setValue(key, servicios[key]);
    });
}

// Prellenar conclusiones
function prefillConclusionsData(conclusiones) {
    if (!conclusiones) return;

    setValue('info_coincide_final', conclusiones.info_coincide_final);
    setValue('vivienda_corresponde', conclusiones.vivienda_corresponde);
    setValue('entorno_adecuado', conclusiones.entorno_adecuado);
    setValue('problemas_analisis', conclusiones.problemas_analisis);
    setValue('problemas_visita', conclusiones.problemas_visita);
    setValue('problemas_agenda', conclusiones.problemas_agenda);
    setValue('candidato_proporciono_toda_info', conclusiones.candidato_proporciono_toda_info);
    setValue('obtencion_info_dentro_domicilio', conclusiones.obtencion_info_dentro_domicilio);
    setValue('actitud_candidato', conclusiones.actitud_candidato);
}

// Prellenar secciones dinámicas
function prefillDynamicSections(formObject) {
    // Familiares
    if (formObject.familiares && formObject.familiares.length > 0) {
        //console.log('Prellenando familiares:', formObject.familiares);
        // Limpiar familiares existentes
        familiaresWrap.innerHTML = '';

        formObject.familiares.forEach(familiar => {
            addFamiliar(familiar);
        });
    }

    // Niveles académicos
    if (formObject.academicos && formObject.academicos.niveles && formObject.academicos.niveles.length > 0) {
        //console.log('Prellenando niveles académicos:', formObject.academicos.niveles);
        const nivelesContainer = document.getElementById('niveles-wrap');
        if (nivelesContainer) {
            nivelesContainer.innerHTML = '';

            formObject.academicos.niveles.forEach(nivel => {
                addNivelAcademic(nivel);
            });
        }
    }

    // Cursos
    if (formObject.academicos && formObject.academicos.cursos && formObject.academicos.cursos.length > 0) {
        //console.log('Prellenando cursos:', formObject.academicos.cursos);
        const cursosContainer = document.getElementById('cursos-wrap');
        if (cursosContainer) {
            cursosContainer.innerHTML = '';

            formObject.academicos.cursos.forEach(curso => {
                addCursoPrefilled(curso);
            });
        }
    }

    // Investigación laboral (empresas)
    if (formObject.investigacion_laboral && formObject.investigacion_laboral.length > 0) {
        //console.log('Prellenando empresas:', formObject.investigacion_laboral);
        const empresasContainer = document.getElementById('empresas-wrap');
        if (empresasContainer) {
            empresasContainer.innerHTML = '';

            formObject.investigacion_laboral.forEach(empresa => {
                addEmpresaPrefilled(empresa);
            });
        }
    }

    // Referencias
    prefillReferencesDynamic(formObject.referencias);
}

// Prellenar referencias dinámicas
function prefillReferencesDynamic(referencias) {
    if (!referencias) return;

    // Referencias personales
    if (referencias.personales && referencias.personales.length > 0) {
        const container = document.getElementById('refs-personales-wrap');
        if (container) {
            container.innerHTML = '';
            referencias.personales.forEach(ref => {
                addReferenciaPrefilled('refs-personales-wrap', 'personal', ref);
            });
        }
    }

    // Referencias laborales
    if (referencias.laborales && referencias.laborales.length > 0) {
        const container = document.getElementById('refs-laborales-wrap');
        if (container) {
            container.innerHTML = '';
            referencias.laborales.forEach(ref => {
                addReferenciaPrefilled('refs-laborales-wrap', 'laboral', ref);
            });
        }
    }

    // Referencias vecinales
    if (referencias.vecinal && referencias.vecinal.length > 0) {
        const container = document.getElementById('refs-vecinal-wrap');
        if (container) {
            container.innerHTML = '';
            referencias.vecinal.forEach(ref => {
                addReferenciaPrefilled('refs-vecinal-wrap', 'vecinal', ref);
            });
        }
    }

    // Referencias familiares
    if (referencias.familiar && referencias.familiar.length > 0) {
        const container = document.getElementById('refs-familiar-wrap');
        if (container) {
            container.innerHTML = '';
            referencias.familiar.forEach(ref => {
                addReferenciaPrefilled('refs-familiar-wrap', 'familiar', ref);
            });
        }
    }
}


function activateConditionalSections() {
    // Motocicleta
    const cuentaMotocicleta = document.getElementById('cuenta_motocicleta');
    if (cuentaMotocicleta && cuentaMotocicleta.value === 'Sí') {
        toggleDisplay('#motocicleta-block-HasData', true);
    } else {
        toggleDisplay('#motocicleta-block-NullData', true);
    }

    // Celular
    const cuentaCelular = document.getElementById('cuenta_celular');
    if (cuentaCelular && cuentaCelular.value === 'Sí') {
        toggleDisplay('#celular-block-HasData', true);
    } else {
        toggleDisplay('#celular-block-NullData', true);
    }

    // Estudia actualmente
    const estudiaActualmente = document.querySelector('input[name="estudia_actualmente"]:checked');
    if (estudiaActualmente && estudiaActualmente.value === 'Sí') {
        toggleDisplay('#que_estudia_field', true);
    }

    // Vehículo
    const tieneVehiculo = document.querySelector('input[name="tiene_vehiculo"]:checked');
    if (tieneVehiculo) {
        toggleDisplay('#vehiculo-block', tieneVehiculo.value === 'Sí');
    }
}

/* -----------------------
   FUNCIONES PARA SECCIONES DINÁMICAS (CON PRELLENADO)
   ----------------------- */

// Helper para crear elementos DOM
function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else node.setAttribute(k, v);
    });
    children.forEach(c => node.appendChild(c));
    return node;
}

// Familiares con prefill
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
        { id: `${id}_nombre`, label: 'Nombre', type: 'text', class: 'salav-field' },
        { id: `${id}_edad`, label: 'Edad', type: 'number', class: 'salav-field' },
        { id: `${id}_parentesco`, label: 'Parentesco', type: 'text', class: 'salav-field' },
        { id: `${id}_estudios`, label: 'Último grado de estudios', type: 'select', options: ['', 'Primaria', 'Secundaria', 'Preparatoria', 'Licenciatura', 'Maestría', 'Doctorado'], class: 'salav-field' },
        { id: `${id}_ocupacion`, label: 'Ocupación', type: 'text', class: 'salav-field' },
        { id: `${id}_empresa`, label: 'Empresa para la que trabaja', type: 'text', class: 'salav-field' },
        { id: `${id}_telefono`, label: 'Teléfono', type: 'text', class: 'salav-field' }
    ];

    fields.forEach(f => {
        const fld = el('div', { class: f.class });
        const lbl = el('label', { for: f.id, html: f.label });
        fld.appendChild(lbl);
        if (f.type === 'select') {
            const s = el('select', { id: f.id, name: f.id });
            f.options.forEach(opt => {
                const op = document.createElement('option');
                op.innerText = opt;
                if (opt === '') op.value = '';
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

    // Prefill values if provided
    if (prefill.nombre) setValue(`${id}_nombre`, prefill.nombre);
    if (prefill.edad) setValue(`${id}_edad`, prefill.edad);
    if (prefill.parentesco) setValue(`${id}_parentesco`, prefill.parentesco);
    if (prefill.estudios) setValue(`${id}_estudios`, prefill.estudios);
    if (prefill.ocupacion) setValue(`${id}_ocupacion`, prefill.ocupacion);
    if (prefill.empresa) setValue(`${id}_empresa`, prefill.empresa);
    if (prefill.telefono) setValue(`${id}_telefono`, prefill.telefono);
}

// Niveles académicos con prefill
function addNivelAcademic(prefill = {}) {
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
    ['', 'Primaria', 'Secundaria', 'Preparatoria', 'Carrera técnica', 'Licenciatura', 'Maestría', 'Doctorado']
        .forEach(opt => {
            const o = document.createElement('option');
            o.value = opt;
            o.text = opt || '--';
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

    // Prefill values
    if (prefill.ultimo_nivel) setValue(`ultimo_nivel_${idx}`, prefill.ultimo_nivel);
    if (prefill.institucion) setValue(`institucion_${idx}`, prefill.institucion);
    if (prefill.entidad_federativa) setValue(`entidad_federativa_${idx}`, prefill.entidad_federativa);
    if (prefill.documento_recibido) setValue(`documento_recibido_${idx}`, prefill.documento_recibido);
}

// Cursos con prefill
function addCursoPrefilled(prefill = {}) {
    cursoCount++;
    const id = 'curso_' + cursoCount;
    const cont = el('div', { class: 'salav-grid', id: id + '_wrap' });
    cont.style.border = '1px dashed rgba(27,27,27,0.06)';
    cont.style.padding = '8px';
    cont.style.borderRadius = '8px';

    const nombre = el('div', { class: 'salav-field' });
    nombre.appendChild(el('label', { for: id + '_nombre', html: 'Nombre del curso o certificación' }));
    nombre.appendChild(el('input', { id: id + '_nombre', name: id + '_nombre', type: 'text' }));

    const duracion = el('div', { class: 'salav-field' });
    duracion.appendChild(el('label', { for: id + '_duracion', html: 'Duración en horas' }));
    duracion.appendChild(el('input', { id: id + '_duracion', name: id + '_duracion', type: 'number' }));

    const remove = el('button', { type: 'button', class: 'btn salav-small-btn', html: 'Eliminar' });
    remove.addEventListener('click', () => cont.remove());

    cont.appendChild(nombre);
    cont.appendChild(duracion);
    cont.appendChild(remove);

    const cursosWrap = document.getElementById('cursos-wrap');
    if (cursosWrap) cursosWrap.appendChild(cont);

    // Prefill values
    if (prefill.nombre) setValue(id + '_nombre', prefill.nombre);
    if (prefill.duracion_horas) setValue(id + '_duracion', prefill.duracion_horas);
}

// Empresas con prefill
function addEmpresaPrefilled(prefill = {}) {
    empresaCount++;
    const id = 'empresa_' + empresaCount;
    const cont = el('div', { class: 'salav-grid', id: id + '_wrap' });
    cont.style.border = '1px dashed rgba(27,27,27,0.06)';
    cont.style.padding = '8px';
    cont.style.borderRadius = '8px';

    const nombre = el('div', { class: 'salav-field' });
    nombre.appendChild(el('label', { for: id + '_nombre', html: 'Nombre / Razón social' }));
    nombre.appendChild(el('input', { id: id + '_nombre', name: id + '_nombre', type: 'text' }));

    const periodo = el('div', { class: 'salav-field' });
    periodo.appendChild(el('label', { for: id + '_periodo', html: 'Periodo' }));
    periodo.appendChild(el('input', { id: id + '_periodo', name: id + '_periodo', type: 'text' }));

    const prestaciones = el('div', { class: 'salav-field' });
    prestaciones.appendChild(el('label', { for: id + '_prestaciones', html: 'Prestaciones con las que contaba' }));
    const sel = el('select', { id: id + '_prestaciones', name: id + '_prestaciones' });
    ['No contaba', 'Prestaciones de ley', 'Prestaciones superiores'].forEach(o => {
        const op = document.createElement('option');
        op.innerText = o;
        sel.appendChild(op);
    });
    prestaciones.appendChild(sel);

    const motivo = el('div', { class: 'salav-field' });
    motivo.appendChild(el('label', { for: id + '_motivo', html: 'Motivo de finalización' }));
    motivo.appendChild(el('input', { id: id + '_motivo', name: id + '_motivo', type: 'text' }));

    const rem = el('button', { type: 'button', class: 'btn salav-small-btn', html: 'Eliminar' });
    rem.addEventListener('click', () => cont.remove());

    cont.appendChild(nombre);
    cont.appendChild(periodo);
    cont.appendChild(prestaciones);
    cont.appendChild(motivo);
    cont.appendChild(rem);

    const empresasWrap = document.getElementById('empresas-wrap');
    if (empresasWrap) empresasWrap.appendChild(cont);

    // Prefill values
    if (prefill.nombre) setValue(id + '_nombre', prefill.nombre);
    if (prefill.periodo) setValue(id + '_periodo', prefill.periodo);
    if (prefill.prestaciones) setValue(id + '_prestaciones', prefill.prestaciones);
    if (prefill.motivo_fin) setValue(id + '_motivo', prefill.motivo_fin);
}

// Referencias con prefill
function addReferenciaPrefilled(wrapId, tipo, prefill = {}) {
    const wrap = document.getElementById(wrapId);
    if (!wrap) return;

    const cont = el('div', { class: 'salav-grid' });
    cont.style.border = '1px dashed rgba(27,27,27,0.06)';
    cont.style.padding = '8px';
    cont.style.borderRadius = '8px';

    const nombre = el('div', { class: 'salav-field' });
    nombre.appendChild(el('label', { html: 'Nombre' }));
    nombre.appendChild(el('input', { type: 'text', value: prefill.nombre || '' }));

    const relacion = el('div', { class: 'salav-field' });
    relacion.appendChild(el('label', { html: tipo === 'laboral' ? 'Puesto' : 'Parentesco' }));
    relacion.appendChild(el('input', { type: 'text', value: prefill.relacion || '' }));

    const telefono = el('div', { class: 'salav-field' });
    telefono.appendChild(el('label', { html: 'Teléfono / WhatsApp' }));
    telefono.appendChild(el('input', { type: 'text', value: prefill.telefono || '' }));

    const tiempo = el('div', { class: 'salav-field' });
    tiempo.appendChild(el('label', { html: '¿Tiempo de conocerse?' }));
    tiempo.appendChild(el('input', { type: 'text', value: prefill.tiempo_conocerse || '' }));

    const rem = el('button', { type: 'button', class: 'btn salav-small-btn', html: 'Eliminar' });
    rem.addEventListener('click', () => cont.remove());

    cont.appendChild(nombre);
    cont.appendChild(relacion);
    cont.appendChild(telefono);
    cont.appendChild(tiempo);
    cont.appendChild(rem);
    wrap.appendChild(cont);
}

/* -----------------------
   FUNCIONES EXISTENTES (CON ALGUNAS MODIFICACIONES)
   ----------------------- */

// Finalizar tarea
async function finalizarTarea(userId, etapaKey, token) {
    //console.log(etapaKey, userId);
    try {
        const body = { [etapaKey]: true };
        const res = await axios.patch(`${API_URL}user-progress/${userId}`, body, {
            headers: { Authorization: `Bearer ${token}` }
        });
        mostrarModalMensaje("Tarea finalizada con éxito ✅");
    } catch (error) {
        mostrarModalMensaje("❌ Ocurrió un error al finalizar la tarea");
    }
}

// Mostrar modal de mensaje
function mostrarModalMensaje(mensaje) {
    // Implementación básica - puedes usar tu propia implementación
    alert(mensaje);
}

function mostrarModalMensajeForm(mensaje) {
    // Implementación básica - puedes usar tu propia implementación
    alert(mensaje);
}

// Lógica de mostrar/ocultar condicional
function toggleDisplay(selector, show) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    el.style.display = show ? '' : 'none';
}

/* -----------------------
   EVENT LISTENERS Y CONFIGURACIÓN INICIAL
   ----------------------- */

// Configurar event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar navegación y otros elementos
    initializeNavigation();

    // Configurar event listeners para elementos dinámicos
    setupDynamicEventListeners();

    // Configurar lógica condicional
    setupConditionalLogic();

    // Configurar manejo de archivos
    setupFileUploads();

    // Prellenar formulario si hay datos
    if (USER_ID && USER_ID !== 'anonymous_user') {
        setTimeout(() => {
            prefillForm();
        }, 500);
    }
});

// Inicializar navegación
function initializeNavigation() {
    const sections = Array.from(document.querySelectorAll('.salav-card'));
    if (!sections.length) return;

    let current = 0;
    sections.forEach((s, i) => { s.classList.toggle('active', i === 0); });

    const dotsContainer = document.getElementById('sectionDots');
    if (dotsContainer) {
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
    }

    // Configurar navegación
    let nav = document.querySelector('.navigation');
    if (!nav) {
        nav = document.createElement('div');
        nav.className = 'navigation';
        const form = document.getElementById('salav-form');
        if (form) form.appendChild(nav);
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

    function updateProgress() {
        const total = sections.length;
        const pct = Math.round(((current + 1) / total) * 100);
        const progressFill = document.getElementById('progressFill');
        const progressLabel = document.getElementById('progressLabel');
        const progressPercent = document.getElementById('progressPercent');

        if (progressFill) progressFill.style.width = pct + '%';
        if (progressLabel) progressLabel.textContent = `Sección ${current + 1} / ${total}`;
        if (progressPercent) progressPercent.textContent = `${pct}%`;

        Array.from(document.querySelectorAll('.section-dot')).forEach((d, idx) => {
            d.classList.toggle('active', idx === current);
            d.classList.toggle('completed', idx < current);
        });
    }

    goTo(0);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') goTo(current + 1);
        if (e.key === 'ArrowLeft') goTo(current - 1);
    });
}

// Configurar event listeners para elementos dinámicos
function setupDynamicEventListeners() {
    // Botón agregar familiar
    const addFamiliarBtn = document.getElementById('add-familiar-btn');
    if (addFamiliarBtn) {
        addFamiliarBtn.addEventListener('click', () => addFamiliar());
    }

    // Botón agregar nivel académico
    const addNivelBtn = document.getElementById('add-nivel-btn');
    if (addNivelBtn) {
        addNivelBtn.addEventListener('click', function () {
            addNivelAcademic();
        });
    }

    // Botón agregar curso
    const addCursoBtn = document.getElementById('add-curso-btn');
    if (addCursoBtn) {
        addCursoBtn.addEventListener('click', () => {
            addCursoPrefilled();
        });
    }

    // Botón agregar empresa
    const addEmpresaBtn = document.getElementById('add-empresa-btn');
    if (addEmpresaBtn) {
        addEmpresaBtn.addEventListener('click', () => {
            addEmpresaPrefilled();
        });
    }

    // Botones para referencias
    const addRefPersonal = document.getElementById('add-ref-personal');
    const addRefLaboral = document.getElementById('add-ref-laboral');
    const addRefVecinal = document.getElementById('add-ref-vecinal');
    const addRefFamiliar = document.getElementById('add-ref-familiar');

    if (addRefPersonal) addRefPersonal.addEventListener('click', () => addReferenciaPrefilled('refs-personales-wrap', 'personal'));
    if (addRefLaboral) addRefLaboral.addEventListener('click', () => addReferenciaPrefilled('refs-laborales-wrap', 'laboral'));
    if (addRefVecinal) addRefVecinal.addEventListener('click', () => addReferenciaPrefilled('refs-vecinal-wrap', 'vecinal'));
    if (addRefFamiliar) addRefFamiliar.addEventListener('click', () => addReferenciaPrefilled('refs-familiar-wrap', 'familiar'));
}

// Configurar lógica condicional
function setupConditionalLogic() {
    // vehículo
    const tieneVehiculoSi = document.getElementById('tiene_vehiculo_si');
    const tieneVehiculoNo = document.getElementById('tiene_vehiculo_no');

    if (tieneVehiculoSi) tieneVehiculoSi.addEventListener('change', () => toggleDisplay('#vehiculo-block', true));
    if (tieneVehiculoNo) tieneVehiculoNo.addEventListener('change', () => toggleDisplay('#vehiculo-block', false));

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
    document.querySelectorAll('input[name="estudia_actualmente"]').forEach(r => {
        r.addEventListener('change', (e) => {
            toggleDisplay('#que_estudia_field', e.target.value === 'Sí');
        });
    });

    // Salud - justificaciones
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
        document.querySelectorAll(`input[name="${radioName}"]`).forEach(r => {
            r.addEventListener('change', (e) => {
                toggleDisplay('#' + justId, e.target.value === 'Sí');
            });
        });
    });
}

// Configurar manejo de archivos
// Configurar manejo de archivos
function setupFileUploads() {
    const MAX_MB = 3;
    const MAX_BYTES = MAX_MB * 1024 * 1024;

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const dm = 2;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Función para crear miniaturas
    function createThumbnail(file, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Limpiar contenedor existente
        container.innerHTML = '';

        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.style.maxWidth = '100px';
            img.style.maxHeight = '100px';
            img.style.cursor = 'pointer';
            img.style.margin = '5px';
            img.style.border = '1px solid #ddd';
            img.style.borderRadius = '4px';

            // Hacer clic para ampliar
            img.addEventListener('click', () => {
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
                modal.style.display = 'flex';
                modal.style.justifyContent = 'center';
                modal.style.alignItems = 'center';
                modal.style.zIndex = '1000';

                const modalImg = document.createElement('img');
                modalImg.src = img.src;
                modalImg.style.maxWidth = '90%';
                modalImg.style.maxHeight = '90%';
                modalImg.style.objectFit = 'contain';

                modal.appendChild(modalImg);
                modal.addEventListener('click', () => document.body.removeChild(modal));
                document.body.appendChild(modal);
            });

            container.appendChild(img);
        } else {
            // Para archivos no imagen, mostrar icono
            const icon = document.createElement('div');
            icon.innerHTML = '📄';
            icon.style.fontSize = '50px';
            icon.style.textAlign = 'center';
            icon.style.cursor = 'pointer';
            icon.title = 'Haz clic para ver el archivo';

            icon.addEventListener('click', () => {
                const url = URL.createObjectURL(file);
                window.open(url, '_blank');
            });

            container.appendChild(icon);
        }
    }

    // Función para mostrar miniatura desde URL existente
    function showExistingThumbnail(url, containerId, fileName) {
        const container = document.getElementById(containerId);
        if (!container || !url) return;

        container.innerHTML = '';

        // Verificar si es imagen por extensión o tipo MIME
        const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url) ||
            url.includes('drive.google.com') && !url.includes('/edit');

        if (isImage) {
            const img = document.createElement('img');
            img.src = url;
            img.style.maxWidth = '100px';
            img.style.maxHeight = '100px';
            img.style.cursor = 'pointer';
            img.style.margin = '5px';
            img.style.border = '1px solid #ddd';
            img.style.borderRadius = '4px';
            img.alt = fileName || 'Imagen';

            img.addEventListener('click', () => {
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
                modal.style.display = 'flex';
                modal.style.justifyContent = 'center';
                modal.style.alignItems = 'center';
                modal.style.zIndex = '1000';

                const modalImg = document.createElement('img');
                modalImg.src = url;
                modalImg.style.maxWidth = '90%';
                modalImg.style.maxHeight = '90%';
                modalImg.style.objectFit = 'contain';

                modal.appendChild(modalImg);
                modal.addEventListener('click', () => document.body.removeChild(modal));
                document.body.appendChild(modal);
            });

            container.appendChild(img);
        } else {
            // Para archivos no imagen
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.innerHTML = '📄 ' + (fileName || 'Ver archivo');
            link.style.display = 'block';
            link.style.padding = '5px';
            link.style.textDecoration = 'none';
            link.style.color = '#007bff';
            container.appendChild(link);
        }
    }

    const fileUploads = document.querySelectorAll('.file-upload');

    fileUploads.forEach(upload => {
        const input = upload.querySelector('input');
        const fileName = upload.nextElementSibling;

        // Crear contenedor para miniatura si no existe
        const thumbnailId = input.id + '_thumbnail';
        if (!document.getElementById(thumbnailId)) {
            const thumbnailContainer = document.createElement('div');
            thumbnailContainer.id = thumbnailId;
            thumbnailContainer.style.marginTop = '5px';
            upload.parentNode.insertBefore(thumbnailContainer, fileName.nextSibling);
        }

        upload.addEventListener('click', () => input.click());

        input.addEventListener('change', async () => {
            if (!input.files || input.files.length === 0) {
                fileName.textContent = '';
                // Limpiar miniatura
                const thumbnailContainer = document.getElementById(thumbnailId);
                if (thumbnailContainer) thumbnailContainer.innerHTML = '';
                return;
            }

            const files = Array.from(input.files);
            const oversize = files.filter(f => f.size > MAX_BYTES);

            if (oversize.length > 0) {
                const listNames = oversize.map(f => `${f.name} (${formatBytes(f.size)})`).join(', ');
                mostrarModalMensajeForm(`El archivo ${listNames} debe pesar menos de ${MAX_MB} MB. ❌`);
                input.value = '';
                fileName.textContent = '';
                // Limpiar miniatura
                const thumbnailContainer = document.getElementById(thumbnailId);
                if (thumbnailContainer) thumbnailContainer.innerHTML = '';
                return;
            }

            // Mostrar miniatura del nuevo archivo
            createThumbnail(files[0], thumbnailId);

            if (input.multiple) {
                fileName.textContent = `${files.length} archivos seleccionados`;
            } else {
                fileName.textContent = files[0].name;
            }

            // Subida a Google Drive
            const file = files[0];
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
                const safeUploadId = String(upload.id || '')
                    .replace(/-/g, '_')
                    .replace(/\s+/g, '_');

                setUploadUrl(safeUploadId, url);

            } catch (err) {
                console.error('Error subiendo archivo:', err);
                mostrarModalMensajeForm('Error al subir el archivo. Revisa la consola para más detalles. ❌');
            }
        });
    });
}

/* -----------------------
   MANEJO DE ENVÍO DEL FORMULARIO
   ----------------------- */

// Event listener para el envío del formulario
if (formEl) {
    formEl.addEventListener('submit', function (e) {
        e.preventDefault();
        handleFormSubmit();
    });
}

// Función para manejar el envío del formulario
async function handleFormSubmit() {
    // variables independientes 
    const correo = document.getElementById('correo').value;
    const folio = document.getElementById('folio').value;
    const fecha_solicitud = document.getElementById('fecha_solicitud').value;
    const fecha_visita = document.getElementById('fecha_visita').value;
    const puesto = document.getElementById('puesto').value;
    const fotografia = document.getElementById('fotografia').files.length ? Array.from(document.getElementById('fotografia').files).map(f => f.name) : null;

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
    const croquis = document.getElementById('croquis').files.length ? Array.from(document.getElementById('croquis').files).map(f => f.name) : null;
    const foto_fachada_exterior = document.getElementById('foto_fachada_exterior').files.length ? Array.from(document.getElementById('foto_fachada_exterior').files).map(f => f.name) : null;
    const foto_fachada_interior = document.getElementById('foto_fachada_interior').files.length ? Array.from(document.getElementById('foto_fachada_interior').files).map(f => f.name) : null;
    const foto_sala = document.getElementById('foto_sala').files.length ? Array.from(document.getElementById('foto_sala').files).map(f => f.name) : null;
    const foto_entregando_documentos = document.getElementById('foto_entregando_documentos').files.length ? Array.from(document.getElementById('foto_entregando_documentos').files).map(f => f.name) : null;

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
    function filesList(id) { return document.getElementById(id) && document.getElementById(id).files.length ? Array.from(document.getElementById(id).files).map(f => f.name) : null; }
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

    /* -----------------------
       JSON completo
       ----------------------- */
    const formJSON = {
        meta: { generado_en: new Date().toISOString() },
        datos_generales: { correo, folio, fecha_solicitud, fecha_visita, puesto, url_fotografia_upload },
        empresa_valuadora: { valuador_nombre },
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
            cuenta_computadora, cuenta_bicicleta, cuenta_tablet, cuenta_refri, cuenta_tv, cuenta_microondas,
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
        identificadores: { USER_PROGRESS, USER_ID }
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
    //console.log("form data ", id_form);
    const body = {
        applicant_id: USER_ID,
        form_object: formJSON
    };

    try {
        //console.log("📄 Generando y subiendo PDF...");
        // 1️⃣ Generar y subir PDF primero
        await generarYSubirPDF({ form_object: body }, token_a);
        //console.log("✅ PDF generado y 'estudio_url' actualizado.");

        // 2️⃣ Actualizar el formulario
        const response = await axios.patch(`${API_URL}form/${id_form}`, body, {
            headers: {
                Authorization: `Bearer ${token_a}`
            },
        });

        // 3️⃣ Actualizar progreso solo si el PDF se generó correctamente
        const bodyProgress = { evaluation_complete: true };
        await axios.patch(`${API_URL}user-progress/${USER_PROGRESS}`, bodyProgress, {
            headers: { Authorization: `Bearer ${token_a}` }
        });

        mostrarModalMensajeForm("✅ Formulario guardado");
        setTimeout(() => {
            window.location.replace("estudiosProceso.html");
        }, 5000);

    } catch (err) {
        // ❌ Si falla la generación o cualquier patch, no se marca como completado
        mostrarModalMensajeForm(
            "❌ Error al guardar el form o generar el PDF: " +
            (err.response?.data?.message || err.message)
        );
    }

}



async function generarYSubirPDF(formBody, token_a) {
    try {
        const formJSON = formBody.form_object;
        if (!formJSON) throw new Error("❌ No se encontró 'form_object' dentro de formBody");

        const progressId = formJSON?.form_object?.identificadores?.USER_PROGRESS;
        if (!progressId) throw new Error("El JSON no tiene identificadores.USER_PROGRESS");

        // === Obtener datos del candidato ===
        const progressRes = await axios.get(`${API_URL}user-progress/${progressId}`, {
            headers: { Authorization: `Bearer ${token_a}` },
        });
        const { number: numeroSolicitud, bg_check_url: bgId, cv_url: cvId } = progressRes.data || {};

        // === Funciones auxiliares ===
        function toTitleCase(key) {
            return key
                .split("_")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");
        }

        function generarCarpeta(nombreCompleto) {
            const nombres = nombreCompleto.split(" ");
            const nombre = nombres[0] || "";
            const apellido = nombres[1] || "";
            return nombre.slice(0, 3) + apellido.slice(0, 2);
        }

        async function downloadDriveFile(fileId) {
            if (!fileId) return null;
            const url = `https://drive.google.com/uc?id=${fileId}&export=download`;
            const res = await fetch(url);
            if (!res.ok) return null;
            return await res.arrayBuffer();
        }

        // === Cargar imágenes base ===
        const fondoBytes = await fetch("../../img/FONDO CLARO.png").then(r => r.arrayBuffer());
        const logoBytes = await fetch("../../img/FONDO CLARO.png").then(r => r.arrayBuffer());
        const pieBytes = await fetch("../../img/Pie_salav.jpeg").then(r => r.arrayBuffer());

        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([612, 792]);
        const { width, height } = page.getSize();

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const fondoImg = await pdfDoc.embedPng(fondoBytes);
        const logoImg = await pdfDoc.embedPng(logoBytes);
        const pieImg = await pdfDoc.embedJpg(pieBytes);

        // === Fondo general ===
        function drawBackground(p) {
            const fondoDims = fondoImg.scale(1);
            const scale = Math.min(width / fondoDims.width, height / fondoDims.height) * 0.9;
            const imgWidth = fondoDims.width * scale;
            const imgHeight = fondoDims.height * scale;
            const x = (width - imgWidth) / 2;
            const y = (height - imgHeight) / 2;

            p.drawImage(fondoImg, { x, y, width: imgWidth, height: imgHeight, opacity: 0.15 });
            p.drawImage(logoImg, { x: width - 140, y: height - 60, width: 120, height: 40 });

            const pieDims = pieImg.scale(0.4);
            const pieWidth = pieDims.width;
            const pieHeight = pieDims.height;
            const pieX = (width - pieWidth) / 2;
            const pieY = 0;
            p.drawImage(pieImg, { x: pieX, y: pieY, width: pieWidth, height: pieHeight });
        }

        drawBackground(page);
        let yPos = height - 120;

        function checkSpace(rows = 1) {
            if (yPos - rows * 20 < 100) {
                page = pdfDoc.addPage([612, 792]);
                drawBackground(page);
                yPos = height - 100;
            }
        }

        // === Dibujar campos e imágenes ===
        async function drawField(label, value) {
            checkSpace(2);

            // 🔹 Si el valor es una URL de Google Drive → insertar imagen centrada
            if (typeof value === "string" && value.includes("drive.google.com")) {
                const match = value.match(/\/d\/(.*?)\//);
                const fileId = match ? match[1] : null;
                const buffer = await downloadDriveFile(fileId);
                if (buffer) {
                    try {
                        let img;
                        try {
                            img = await pdfDoc.embedJpg(buffer);
                        } catch {
                            img = await pdfDoc.embedPng(buffer);
                        }

                        // Texto con el nombre del campo
                        checkSpace(3);
                        page.drawText(`${label}:`, {
                            x: width / 2 - 100,
                            y: yPos,
                            size: 12,
                            font: fontBold,
                            color: rgb(0, 0, 0.5),
                        });
                        yPos -= 15;

                        // Imagen centrada y de media página
                        const imgMaxWidth = width * 0.6;
                        const imgMaxHeight = height / 2;
                        const ratio = Math.min(imgMaxWidth / img.width, imgMaxHeight / img.height);
                        const imgWidth = img.width * ratio;
                        const imgHeight = img.height * ratio;
                        const x = (width - imgWidth) / 2;
                        const y = yPos - imgHeight;

                        // Agregar imagen
                        page.drawImage(img, { x, y, width: imgWidth, height: imgHeight });
                        yPos -= imgHeight + 20;
                        return;
                    } catch {
                        value = "[Imagen no disponible]";
                    }
                }
            }

            // 🔸 Campo normal (texto)
            page.drawRectangle({
                x: 45,
                y: yPos - 4,
                width: width - 90,
                height: 18,
                borderColor: rgb(0.8, 0.8, 0.8),
                borderWidth: 0.5,
            });
            page.drawText(`${label}: ${value ?? ""}`, {
                x: 50,
                y: yPos,
                size: 9,
                font,
                color: rgb(0.2, 0.2, 0.2),
            });
            yPos -= 20;
        }

        async function drawObject(title, obj) {
            checkSpace(2);
            page.drawText(title, {
                x: 50,
                y: yPos,
                size: 13,
                font: fontBold,
                color: rgb(0, 0, 0.6),
            });
            yPos -= 20;
            for (const [key, value] of Object.entries(obj)) {
                if (value && typeof value === "object" && !Array.isArray(value)) {
                    await drawObject(toTitleCase(key), value);
                } else if (Array.isArray(value)) {
                    for (const item of value) {
                        if (typeof item === "object") await drawObject(toTitleCase(key), item);
                        else await drawField(toTitleCase(key), item);
                    }
                } else {
                    await drawField(toTitleCase(key), value);
                }
            }
        }

        // === Construcción principal del PDF ===
        page.drawText("Formulario Salav", {
            x: width / 2 - 60,
            y: yPos,
            size: 18,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        yPos -= 40;

        for (const [key, value] of Object.entries(formJSON)) {
            if (typeof value === "object") await drawObject(toTitleCase(key), value);
            else await drawField(toTitleCase(key), value);
        }

        // === Anexar PDF externos ===
        async function anexarPDF(fileId, label) {
            if (!fileId) return;
            const bytes = await downloadDriveFile(fileId);
            if (!bytes) return;
            const externo = await PDFDocument.load(bytes);
            const pages = await pdfDoc.copyPages(externo, externo.getPageIndices());
            pages.forEach((p) => pdfDoc.addPage(p));
        }

        await anexarPDF(bgId, "Verificación de antecedentes");
        await anexarPDF(cvId, "Currículum");

        // === Guardar PDF ===
        const candidatoNombre = formJSON.form_object?.candidato?.candidato_nombre || "GENERIC";
        const carpeta = generarCarpeta(candidatoNombre);
        const nombreArchivo = `${numeroSolicitud || Date.now()}_${carpeta}_Cuestionario.pdf`;

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });

        // === Subir a Google Drive ===
        const formData = new FormData();
        formData.append("file", blob, nombreArchivo);
        formData.append("path", `${numeroSolicitud || carpeta}/Cuestionario`);

        const uploadRes = await axios.post(`${API_URL}google/upload`, formData, {
            headers: { Authorization: `Bearer ${token_a}` },
        });

        // === Actualizar user-progress con estudio_url ===
        if (uploadRes.data?.id) {
            await axios.patch(
                `${API_URL}user-progress/${progressId}`,
                { estudio_url: uploadRes.data.id },
                { headers: { Authorization: `Bearer ${token_a}` } }
            );
        }

    } catch (err) {
        console.error("❌ Error al generar o subir el PDF:", err);
        throw err;
    }
}
