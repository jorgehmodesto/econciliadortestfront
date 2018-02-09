function loadView(page)
{
    $.get('public/views/' + page + '.html', {}, function(pageContent){
        $('#content').html(pageContent);
    });
}

function importCommits() {
    $('#error-message').addClass('hide');
    $('#success-message').addClass('hide');
    $('#loading').removeClass('hide');

    var repository = $('#repository').val();
    var aRepository = repository.split('/');

    if(aRepository.length != 2) {
        $('#loading').addClass('hide');
        $('#error-message').html('Você deve informar o repositório no formato "owner/repositório"');
        $('#error-message').removeClass('hide');
    } else {
        var owner = aRepository[0];
        var repo = aRepository[1];

        $.getJSON('http://econciliadorapitest.local/api/import/owner/' + owner + '/repo/' + repo, {}, function(r){
            $('#loading').addClass('hide');
            if(r.success == true) {
                $('#success-message').html("Histórico de commits importado com sucesso. Acesse o <a href='javascript:loadView(\"commits_report\")'>relatório</a> para consultar os dados");
                $('#success-message').removeClass('hide');
            } else {
                $('#error-message').html(r.message);
                $('#error-message').removeClass('hide');
            }
        });
    }
}

function commitsReport()
{
    $('#error-message').addClass('hide');
    $('#success-message').addClass('hide');
    $('#loading').removeClass('hide');
    $('#exportDataContent').addClass('hide');

    var repository = $('#repository').val();
    var aRepository = repository.split('/');

    if(aRepository.length != 2) {
        $('#loading').addClass('hide');
        $('#error-message').html('Você deve informar o repositório no formato "owner/repositório"');
        $('#error-message').removeClass('hide');
    } else {

        var owner = aRepository[0];
        var repo = aRepository[1];

        $.getJSON('http://econciliadorapitest.local/api/export/owner/' + owner + '/repo/' + repo, {}, function(r){
            $('#loading').addClass('hide');

            if(r.success === true) {
                var tableBody = '';

                console.log(r);

                $('#owner_name').html(r.records.owner);
                $('#total_commits_by_repository').html(r.records.total_commits);
                $('#repository_name').html(r.records.repository);

                $.each(r.records.authors, function(i, author) {
                    tableBody += "<tr>";
                        tableBody += "<th scope='row'>" + author.name + "</th>";
                        tableBody += "<td>" + author.username + "</td>";
                        tableBody += "<td>" + author.github_id + "</td>";
                        tableBody += "<td>" + author.total_commits + "</td>";
                    tableBody += "</tr>";
                });

                $('#tableAuthorsContent').html(tableBody);

                $('#exportDataContent').removeClass('hide');

            } else {

                var message = r.message;

                if(message === 'not_found') {
                    message = 'Repositório não encontrado. Clique <a href="javascript:loadView(\'import_repositories\')">aqui</a> se desejar importar o repositório.';
                }

                $('#error-message').html(message);
                $('#error-message').removeClass('hide');
            }
        });
    }
}