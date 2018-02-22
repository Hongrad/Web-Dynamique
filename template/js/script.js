function addQuestionHTML() {
  var content = $(".content");
  var nbQuestion = content.children().length;
  var divCQues = $("<div>").addClass("creerQ-question")
                            .append($("<p>").addClass("titreQuestion").append("Question "+nbQuestion+" /").append($("<input type=\"text\" class=\"titreQuestion\" placeholder=\"Titre de la question\"/>")))
                            .append($("<ul>").append($("<li>Réponse 1 : <input type=\"text\"/></li>"))
                                             .append($("<li>Réponse 2 : <input type=\"text\"/></li>"))
                                             .append($("<li>Réponse 3 : <input type=\"text\"/></li>"))
                                             .append($("<li>Réponse 4 : <input type=\"text\"/></li>"))
                            );
  content.append(divCQues);
}

function addQuestinnaire() {
  
}
