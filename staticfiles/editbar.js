let lastClickedAula = null 

function updateSidebarSelection(idAula, idUc, initTime, timeSpan, day, 
    docentesIdList, salasIdList, turmasIdList){
    const sidebarId = document.querySelector("#editSideBarForm #selectedID")
    sidebarId.value= idAula

    timeSpan = (timeSpan % 2) === 0 ? timeSpan/2*100 : Math.floor(timeSpan/2)*100+30
    let endTime

    if (((initTime + timeSpan) % 100 === 0) || ((initTime + timeSpan) % 100 === 30)){
        endTime = initTime + timeSpan
    }
    else{
        endTime = initTime + timeSpan + 40
    }

    if(idUc !== null) updateSidebarSingle(idUc, "cadeiraEdit")
    if(initTime !== null && initTime>=800 && initTime<=1900) updateSidebarSingle(initTime, "hora-inicio")
    if(initTime!==null && timeSpan!==null && timeSpan>=0
        && endTime>=800 && endTime<=2000) updateSidebarSingle(endTime, "hora-fim")
    if(day!==null) updateSidebarSingle(day, "dia")
    if(docentesIdList!==null && docentesIdList.length>0) updateSidebarMultiple(docentesIdList, '.docentesDropDown')
    if(salasIdList!==null && salasIdList.length>0) updateSidebarMultiple(salasIdList, '.salasDropDown')
    if(turmasIdList!==null && turmasIdList.length>0) updateSidebarMultiple(turmasIdList, '.turmasDropDown')
}

function updateSidebarSingle(id, elementId){
    let dropdown = document.getElementById(elementId);
    dropdown.value = id;
}

function updateSideBarEmpty(initTime, timeSpan, day){
    const sidebarId = document.querySelector("#editSideBarForm #selectedID")
    sidebarId.value= "-1"

    timeSpan = (timeSpan % 2) === 0 ? timeSpan/2*100 : (timeSpan-1)/2*100+30

    if(initTime !== null && initTime>=800 && initTime<=1900) updateSidebarSingle(initTime, "hora-inicio")
    if(initTime!==null && timeSpan!==null && timeSpan>=0
        && (initTime+timeSpan)>=800 && (initTime+timeSpan)<=2000) updateSidebarSingle(initTime + timeSpan, "hora-fim")
    if(day!==null) updateSidebarSingle(day, "dia")

    updateSidebarMultiple([], '.docentesDropDown')
    updateSidebarMultiple([], '.salasDropDown')
    updateSidebarMultiple([], '.turmasDropDown')

    let cadeiras = document.getElementById("cadeiraEdit");
    cadeiras.selectedIndex=-1
}

function updateSidebarMultiple(ids, element){
    let options
    if(element === '.docentesDropDown'){
        options = {
            multipleMode: 'label',
            searchable: true,
            searchNoData: '<li class="cursorHover changeCursor" data-bs-toggle="modal" data-bs-target="#newDocenteModal">Novo Docente</li>'
            }
    }else{
        options = {
            multipleMode: 'label',
            searchable: true,
        }
    }

    let dropdown = $(element).dropdown(options).data('dropdown')
    dropdown.reset()

    //select new options
    ids.forEach(element => {
        dropdown.choose(element, true)
    });
}


function setSidebarUCs(ucSet){
    const selectElement = document.getElementById("cadeiraEdit")
    while (selectElement.firstChild) {
        selectElement.removeChild(selectElement.firstChild);
    }

    ucSet.forEach(uc => {
        let option = document.createElement("option")
        option.value = uc.codigo
        option.text = uc.nome
        selectElement.appendChild(option)
    });
}

function setSidebarTurmas(turmasSet){
    const turmasList = Array.from(turmasSet)
    turmasList.sort()

    const turmasDropDownDiv = document.querySelector(".turmasDropDown")
    
    //formatar
    const list = turmasList.map((str) => {
        return { name: str, id: str };
    });
    
    //criar o dropdown select object e mudar as opcoes
    $(".turmasDropDown").dropdown({
        // options here
        multipleMode: 'label',
        searchable: true,
    }).data("dropdown").update(list, true)
}

function showEditBarOptions(showBool){
    const formDiv = document.getElementById("edit-form-div")
    const hiddenDiv = document.getElementById("edit-form-hidden-div")
    if(showBool){
        if(!hiddenDiv.classList.contains("hidden")) hiddenDiv.classList.add("hidden")
        if(formDiv.classList.contains("hidden")) formDiv.classList.remove("hidden")
        return
    }

    hiddenDiv.classList.remove("hidden")
    formDiv.classList.add("hidden")
}

$(document).ready(function () {
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'e') {
            event.preventDefault(); // Prevent the default browser behavior (e.g., opening the browser's search feature)
            let offcanvas = document.getElementById('offcanvasDarkNavbar');
            let offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
            if (!offcanvasInstance) {
                new bootstrap.Offcanvas(offcanvas).show(); // Initialize and show the offcanvas sidebar
            } else {
                offcanvasInstance.toggle(); // Toggle the offcanvas sidebar
            }
        }
    })
})

function selectedCellSelectSideBar(element, isEmpty){
    //obter o element correto
    while(element.tagName !=="TD"){
        element = element.parentNode
    }
    lastClickedAula = element

    let idUc, initTime, timeSpan, day, idAula
    let docentesIdList=[], salasIdList=[], turmasIdList=[]
    const pList = element.querySelectorAll("p")
    
    //idAula, initTime, timespan, day
    idAula=element.getAttribute("data-aulaid")
    timeSpan = element.hasAttribute("rowspan") ? parseInt(element.getAttribute("rowspan"), 10) : 1

    let timeDayArray = element.id.split("_").slice(-2)
    initTime = parseInt(timeDayArray[1], 10)
    day = switchDaytoNumber(timeDayArray[0])
    
    //uc, docentes e salas
    pList.forEach(p_element => {
        switch (p_element.classList[0]) {
            case "uc":
                idUc = p_element.id
                break;
            case "docente":
                docentesIdList.push(p_element.id)
                break
            case "sala":
                salasIdList.push(p_element.id)
                break;
            default:
                break;
        }
    });

    //turmas
    let turmasSet = new Set()
    let turmasDiv = element.querySelectorAll("div")
    turmasDiv.forEach(div => {
        turmasSet.add(div.id.split("_")[1])
    });
    turmasIdList = Array.from(turmasSet)
    if(isEmpty){
        updateSideBarEmpty(initTime, timeSpan, day)
        return
    }
    updateSidebarSelection(idAula, idUc, initTime, timeSpan, day, docentesIdList, salasIdList, turmasIdList)
}

function switchDaytoNumber(numberString){
    switch (numberString) {
        case "segunda":
            return "0"
        case "terça":
            return "1"
        case "quarta":
            return "2"
        case "quinta":
            return "3"
        case "sexta":
            return "4"
        case "sábado":
            return "5"
        default:
            return null
    }
}

function writeConflicts(arrayOfConflicts){
    $('#conflictsList').empty()
    $.each(arrayOfConflicts, function(key, value){
        $('#conflictsList').append('<li>' + value + '</li>')
    })
}
$(document).ready(function () {
    $('#editSideBarForm').submit(function () {
        event.preventDefault()

        //get project id
        const url = window.location.pathname;
        const id = url.split('/').pop();

        //get data from sidebar
        var turmasIds = [];
        var docentesIds = [];
        var salasIds = [];
    
        $('.turmasDropDown .dropdown-display-label .dropdown-chose-list .dropdown-selected i[data-id]').each(function() {
            let dataId = $(this).data('id');
            turmasIds.push(dataId);
        });
        
        $('.docentesDropDown .dropdown-display-label .dropdown-chose-list .dropdown-selected i[data-id]').each(function() {
            let dataId = $(this).data('id');
            docentesIds.push(dataId);
        });

        $('.salasDropDown .dropdown-display-label .dropdown-chose-list .dropdown-selected i[data-id]').each(function() {
            let dataId = $(this).data('id');
            salasIds.push(dataId);
        });

        if(lastClickedAula.getAttribute('data-teorica') == 0){
            const aulaId = lastClickedAula.getAttribute('data-aulaid')
            const elementId = lastClickedAula.id
            let aulas = Array.from(document.querySelectorAll('[data-aulaid="' + aulaId + '"]'))
            const index = aulas.indexOf(lastClickedAula)
            if(index !== -1){
                aulas.splice(index, 1)
            }

            aulas.forEach(element => {
                const id = element.id
                turmasIds.push(id.split('_')[1])
            });
        }

        var formData = {
            csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
            projId:id,
            aulaId: $('input[name="selectedID"]').val(),
            cadeiraId: $('select[name="cadeiraEdit"]').val(),
            horaInicio: $('select[name="hora-inicio"]').val(),
            horaFim: $('select[name="hora-fim"]').val(),
            dia: $('select[name="dia"]').val(),
            turmasIds: turmasIds,
            docentesIds: docentesIds,
            salasIds: salasIds
        };

        // create an AJAX call
        $.ajax({
            data: JSON.stringify(formData),
            type: $(this).attr('method'), // GET or POST
            url: "/editturnos/"+id+"/makechanges",

            headers:{
                'X-CSRFToken': formData.csrfmiddlewaretoken
            },

            // on success
            success: function (response) {
                //mudar no horario
                console.log("handling")
                handleCursoBtn(0);

                //conflitos
                const conflicts = response.conflicts
                writeConflicts(conflicts)
            },
            // on error
            error: function (response, status, error) {
                console.log(response.responseText)
            }
        });
        
        return false;
    });
})

$(document).ready(function () {
    $('#newDocenteForm').submit(function () {
        event.preventDefault()

        const errorContainer = $('#error-container-docente')
        
        //remove any error message
        errorContainer.empty()

        const url = window.location.pathname;
        const id = url.split('/').pop();

        idDocente = $('input[name="idDocente"]').val()
        nomeDocente = $('input[name="nomeDocente"]').val()
        siglaDocente = $('input[name="siglaDocente"]').val()

        $.ajax({
            data: $(this).serialize(), // get the form data
            type: $(this).attr('method'), // GET or POST
            url: "/editturnos/"+id+"/createDocente/",

            // on success
            success: function (response) {
                $('#newDocenteModal').modal('hide')
                let dropdown =  $(".docentesDropDown").dropdown({
                    multipleMode: 'label',
                    searchable: true,
                    searchNoData: '<li class="cursorHover changeCursor" data-bs-toggle="modal" data-bs-target="#newDocenteModal">Novo Docente</li>'
                }).data("dropdown")
                
                
                //reselecionar docentes
                var docentesIds = []
                $('.docentesDropDown .dropdown-display-label .dropdown-chose-list .dropdown-selected i[data-id]').each(function() {
                    let dataId = $(this).data('id');
                    docentesIds.push(dataId);
                });
                
                dropdown.update([{ name: siglaDocente+' - '+nomeDocente, id: idDocente}], false)
                dropdown.reset()
                docentesIds.forEach(element => {
                    dropdown.choose(element, true)
                });
                //selecionar o novo docente
                dropdown.choose(idDocente, true)
            },
            // on error
            error: function (response, status, error) {
                if(response.status == 409){
                    const errorMessage = $('<p class="text-danger">Número Mecanográfico Inválido ou Repetido!</p>')
                    errorContainer.append(errorMessage)
                }else{
                    console.log(response.responseText)
                    alert(response.responseText)
                }
            }
        });
        return false;
    });
})
