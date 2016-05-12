{function name=createQuizRadio}
<div class="radio">
    <label>
        <input type="radio" name="{$questionNumber}" id="q{$questionNumber}-{$answerNumber}" value="{$answerNumber}">
        <strong>
        {if $answerNumber eq 1}
        A.
        {elseif $answerNumber eq 2}
        B.
        {elseif $answerNumber eq 3}
        C.
        {elseif $answerNumber eq 4}
        D.
        {/if}
        </strong>
        {$answer}
    </label>
</div>
{/function}

<form id="quiz">
{foreach $questions as $question}
    <div class="panel panel-default quiz-question" id="q{$question['OrderNumber']}">
        <div class="panel-heading"><b>{$question['OrderNumber']}. {$question['Question']}</b></div>
        <div class="panel-body">
            {foreach $question['answers'] as $answer}
            {call name=createQuizRadio questionNumber=$question['OrderNumber'] answerNumber=$answer['OrderNumber'] answer=$answer['Answer']}
            {/foreach}
        </div>
    </div>
{/foreach}

</form>