{function name=createQuizRadio}
<div class="radio">
    <label>
        <input type="radio" name="{$questionNumber}" id="q{$questionNumber}-{$answerNumber}" value="{$answerNumber}">
        {$answer}
    </label>
</div>
{/function}

<form id="quiz">
{foreach $questions as $question}
    <div class="quiz-question">
        <p><b>{$question['OrderNumber']}. {$question['Question']}</b></p>
        {foreach $question['answers'] as $answer}
        {call name=createQuizRadio questionNumber=$question['OrderNumber'] answerNumber=$answer['OrderNumber'] answer=$answer['Answer']}
        {/foreach}
    </div>
{/foreach}

</form>