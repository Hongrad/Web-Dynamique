function addQuestionHTML() {
  var content = $(".content");
  var nbQuestion = content.children().length;
  var divCQues = $("<div>").addClass("creerQ-question")
                            .append($("<p>").addClass("titreQuestion").append("Question "+nbQuestion+" /").append($("<input type=\"text\" placeholder=\"Titre de la question\"/><label>Multiple ?<input type=\"checkbox\" onChange=\"updateQuestionType(this);\"/></label>")))
                            .append($("<ul>").append($("<li><input type=\"radio\" name=\"q"+nbQuestion+"\">Réponse 1 : <input type=\"text\"/></li>"))
                                             .append($("<li><input type=\"radio\" name=\"q"+nbQuestion+"\">Réponse 2 : <input type=\"text\"/></li>"))
                                             .append($("<li><input type=\"radio\" name=\"q"+nbQuestion+"\">Réponse 3 : <input type=\"text\"/></li>"))
                                             .append($("<li><input type=\"radio\" name=\"q"+nbQuestion+"\">Réponse 4 : <input type=\"text\"/></li>"))
                            );
  content.append(divCQues);
}

function updateQuestionType(checkbox) {
    var responses = $(checkbox).parent().parent().next().children();
    responses.each(function(index){
      var input = $(this).find("input");
      if(input[0].type=="radio"){
        input[0].checked=false;
        input[0].type="checkbox";
      } else {
        input[0].checked=false;
        input[0].type="radio";
      }
    });
}
