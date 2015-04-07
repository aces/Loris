{if $type == 'training'}
<div class="panel panel-default training-instructions">
    <div class="panel-body">
        {if $contentType=='text' or $contentType=='pdf'}
            Please read the following:
        {elseif $contentType=='video'}
            Please watch the following:
        {elseif $contentType=='quiz'}
            Please complete the quiz below in order to receive certification:
        {/if}
    </div>
</div>
{/if}

<div class="training-content">
    <h4>
        {$title}
    </h4>
    {if $contentType=='text'}
        {$tabVariables}
    {elseif $contentType=='pdf'}
        {include file='training_pdf.tpl' filename=$tabVariables}
    {elseif $contentType=='video'}
        {include file='training_video.tpl' filename=$tabVariables}
    {elseif $contentType=='quiz'}
        {include file='training_quiz.tpl' questions=$tabVariables}
    {/if}
</div>

{if $type == 'training'}
<div class="well well-sm training-complete">
    {if $contentType=='quiz'}
    <button id="quizSubmit" form="quiz" class="btn btn-default btn-success" type="submit">
    {else}
    <button class="btn btn-default btn-agree btn-success" type="button">
    {/if}
        {if $contentType=='quiz'}
            Submit
        {else}
            Agree
        {/if}
    </button>
    {if $contentType=='text' or $contentType=='pdf'}
        I have completed reading this section of the training module.
    {elseif $contentType=='video'}
        I have completed watching this section of the training module.
    {elseif $contentType=='quiz'}
        Submit your answers to the quiz. If any answers are incorrect, you will be prompted to repeat the certification training.
    {/if}
</div>
{/if}