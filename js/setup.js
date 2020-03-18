var userData = JSON.parse(localStorage.getItem('userData')) || {};

function updateMirrorSoftware() {
    $.get("/updateMirror", function (data) {
        console.log(data.status);
        console.log("Updating...");
    });
}

function loadUserDataObject() {
    if ( userData ) {
        var inputFields = document.querySelectorAll( '.userDataField' );
        for ( var i = 0; i < inputFields.length; i++ ) {
            if ( inputFields[ i ][ 'type' ] == "checkbox" ) {
                inputFields[ i ].checked = userData[ inputFields[ i ].id ];
            } else if( inputFields[ i ][ 'type' ] == 'radio')
            {
                if(userData[ inputFields[ i ].id ] == inputFields[ i ].dataset.value){
                    //Set military radio
                    inputFields[ i ].checked = userData[ inputFields[ i ].id ];
                }
            }else{
                inputFields[ i ].value = ( userData[ inputFields[ i ].id ] ) == undefined ? '' : userData[ inputFields[ i ].id ];
            }
        }
    }
}

function saveSettings() {
    var inputFields = document.querySelectorAll( '.userDataField' );

    for ( var i = 0; i < inputFields.length; i++ )
    {
        var element = inputFields[i];

        if ( element.type === "checkbox" )
        {
            userData[ element.id ] = element.checked;
        }
        else if ( element.type === "radio" )
        {
            if ( element.checked )
            {
                userData[ element.id ] = element.dataset.value;
            }
        }
        else 
        {
            userData[ element.id ] = element.value;
        }
    }

    localStorage.setItem( 'userData', JSON.stringify( userData ) );
}

$('.checkbox').change(function () {

    if ($('#' + this.id).prop('checked')) {
        $('#' + this.id + 'Field').prop('disabled', true);
        console.log(this.id);
    } else {
        $('#' + this.id + 'Field').prop('disabled', false);
    }
});


$('form').submit(function (event) {
    event.preventDefault();
    saveSettings();

});

$('#update-mirror').click(function () {
    updateMirrorSoftware();
});

document.addEventListener('DOMContentLoaded', function () {
    loadUserDataObject();
});