@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="https://www.dectell.ec/wp-content/uploads/2020/12/cropped-cropped-dectell_marca-01.png" class="logo"  alt="Digitell Logo">
@else
<img src="https://www.dectell.ec/wp-content/uploads/2020/12/cropped-cropped-dectell_marca-01.png" class="logo" alt="Digitell Logo">
@endif
</a>
</td>
</tr>
