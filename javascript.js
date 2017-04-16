// calculates totals, inputs subtotal percentages and checks that the
// sum of the subtotals isn't greater than the the user's total income
function calculateFigures(spendType) {
  "use strict";
  var sumFixedTotal = 0,
    sumFreeTotal = 0,
    totalSpend = 0,
    periodicSaving = 0,
    $htmlInputs = {
      budgetSubtotals: $('.budgetSubtotals'),
      fixedPercent: $('.fixedPercent'),
      fixedSubtotals: $('.fixedSubtotals'),
      fixedTotal: $('#fixedTotal'),
      freePercent: $('.freePercent'),
      freeSubtotals: $('.freeSubtotals'),
      freeTotal: $('#freeTotal'),
      savings: $('#savings'),
      totalBudget: $('#totalBudget'),
      totals: $('.totals'),
      totalsPercent: $('.totalsPercent')
    };

  // sum free spend subtotals
  $htmlInputs.freeSubtotals.each(function(index) {
    sumFreeTotal = ((sumFreeTotal * 1) +
      (($htmlInputs.freeSubtotals.eq(index).val()) * 1)) * 1;
    inputPercentage($(this).val(), $htmlInputs.totalBudget.val(),
      $htmlInputs.freePercent.eq(index));
  });

  // sum fixed spend subtotals
  $htmlInputs.fixedSubtotals.each(function(index) {
    sumFixedTotal = ((sumFixedTotal * 1) +
      (($htmlInputs.fixedSubtotals.eq(index).val()) * 1)) * 1;
    inputPercentage($(this).val(), $htmlInputs.totalBudget.val(),
      $htmlInputs.fixedPercent.eq(index));
  });

  // update the free and/or the fixed totals
  switch (spendType) {
    case 'freeSpend':
      $htmlInputs.freeTotal.val(sumFreeTotal);
      break;
    case 'fixedSpend':
      $htmlInputs.fixedTotal.val(sumFixedTotal);
      break;
    case undefined:
      $htmlInputs.freeTotal.val(sumFreeTotal);
      $htmlInputs.fixedTotal.val(sumFixedTotal);
  }

  // get figure for total spend
  totalSpend = sumFreeTotal + sumFixedTotal;

  // calculate periodic savings
  if ($htmlInputs.totalBudget.val() !== '') {
    periodicSaving = $htmlInputs.totalBudget.val() - totalSpend;
    $htmlInputs.savings.val(periodicSaving);
    // call function to calculate yearly savings
    calcYearlySavings();
  }

  // input totals percentages
  $htmlInputs.totals.each(function(index) {
    inputPercentage($(this).val(), $htmlInputs.totalBudget.val(),
      $htmlInputs.totalsPercent.eq(index));
  });

  // Check that the sum of the sub totals isn't greater than the Total Budget
  if (totalSpend <= $htmlInputs.totalBudget.val()) {
    $htmlInputs.budgetSubtotals.css('background-color', '#FFFFFF');
    $htmlInputs.totals.css('background-color', '#FFFFFF');
    $('#warningMsg').hide();
  } else if (totalSpend > $htmlInputs.totalBudget.val()) {
    $htmlInputs.budgetSubtotals.css('backgroundColor', '#b22222');
    $htmlInputs.totals.css('backgroundColor', '#b22222');
    $('#warningMsg').show();
  } else {
    alert('An unexpected error has occured');
  }
}

// calculate how much user will save over one year
function calcYearlySavings() {
  "use strict";
  var totalSaving = 0,
    $totalBudget = $('#totalBudget'),
    $frequency = $('#frequency'),
    $periodicSaving = $('#savings'),
    $yearlySavings = $('#yearlySavings');

  if ($totalBudget.val() === '') {
    return;
  }

  // calculate the total saving according to how frequent the user has indicated
  // their income is
  switch ($frequency.val()) {
    case 'Monthly':
      totalSaving = $periodicSaving.val() * 12;
      break;
    case '4 Weekly':
      totalSaving = $periodicSaving.val() * 13;
      break;
    case 'Weekly':
      totalSaving = $periodicSaving.val() * 52;
      break;
    default:
      totalSaving = 0;
  }

  $yearlySavings.val(totalSaving);
}

// calculate and input the percentage of the overall budget represented by
// the sub total
function inputPercentage($subtotalField, $totalBudget, $percentageField) {
  "use strict";
  var percentage = 0;

  $percentageField.prop('readOnly', false);

  if ($subtotalField !== '') {
    percentage = ($subtotalField / $totalBudget) * 100;
    // Input percentage (format to 2 decimal places)
    $percentageField.val(percentage.toFixed(2) + '%');
  } else {
    $percentageField.val('');
  }

  $percentageField.prop('readOnly', true);
}

// converts string to title case
function capFirstLetter(input) {
  "use strict";
  var inputArray = [],
    cleanedArray = [],
    cleanedInput = '';

  inputArray = input.split(' ');
  cleanedArray = inputArray.map(function(val) {
    return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
  });
  cleanedInput = cleanedArray.join(' ');

  return cleanedInput;
}

// Deletes row in budget breakdown tables
function deleteTblRow($tableCell) {
  "use strict";
  var tblID = '',
    funcArg = '';

  tblID = $tableCell.closest('table')
    .attr('id');

  // delete the table row of the selected table cell element
  $tableCell.closest('tr')
    .remove();

  //  check number of table rows
  if ($('#' + tblID + ' tr').length < 22) {
    $('#' + tblID + ' .addRow').prop('disabled', false)
      .removeClass('.disabled')
      .addClass('.active');
  }

  if ($('#totalBudget').val() !== '') {
    // slice the tblID to get the argument for the calc function
    funcArg = tblID.slice(0, tblID.length - 3);
    // recalculate the budget figures
    calculateFigures(funcArg);
  }
}

//Adds user name to page title. Hides name form, and unhides alter name form.
$('#nameSubmit').on('click', function() {
  "use strict";
  var $name = $('#name'),
    $alterName = $('#alterName');

  if ($name.val() !== '') {
    $('#heading').text('Hi ' + $name.val() +
      ', welcome to your new Budget Planner');
    $name.val('');
    $('#enterName').hide();
    if ($alterName.is(':hidden')) {
      $alterName.show();
    }
  }
});

//Displays hidden name form and hides alter name form.
$('#alterName').on('click', function() {
  "use strict";
  var $enterName = $('#enterName');

  if ($enterName.is(':hidden')) {
    $enterName.show();
    $('#alterName').hide();
  }
});

// Check if Total Budget field is populated - only allow user entry in
// Budget breakdown tables if it is populated
$('#totalBudget').on('input', function() {
  "use strict";
  var $htmlInputs = {
    totalBudget: $('#totalBudget'),
    budgetSubtotals: $('.budgetSubtotals'),
    subtotalsPercent: $('.subtotalsPercent'),
    totals: $('.totals'),
    totalsPercent: $('.totalsPercent')
  };

  if ($htmlInputs.totalBudget.val() !== '') {
    $htmlInputs.budgetSubtotals.prop('disabled', false);
    // call calculateFigures function to recalculate any values which
    // have already been entered
    calculateFigures();
  } else if ($htmlInputs.totalBudget.val() === '') {
    $('.reset').click();
  } else {
    alert('An unexpected error has occured');
  }
});

// restore to default any values entered or changed by the user
$('.reset').on('click', function() {
  "use strict";

  $('input').not('.btn')
    .val('')
    .css('background-color', '#FFFFFF');
  $('.budgetSubtotals')
    .prop('disabled', true);
  $('#frequency').val('Monthly');
  $('#warningMsg').hide();
});

$('.freeSubtotals').on('input', function() {
  calculateFigures('freeSpend');
});

$('.fixedSubtotals').on('input', function() {
  calculateFigures('fixedSpend');
});

$('#frequency').on('change', function() {
  calcYearlySavings();
});

$('.deleteRow').on('click', function() {
  deleteTblRow($(this));
});

// Creates a new table row, with three input fields and a button
$('.addRow').on('click', function() {
  "use strict";
  var subtotalClasses = '',
    percentClasses = '',
    tblID = '',
    funcArg = '',
    $table = {},
    $newCategoryEle = {},
    $newSubtotalEle = {},
    $newPercentEle = {},
    $newButtonEle = {},
    $category = $('.category'),
    dupl = false,
    userInput = capFirstLetter(prompt('Please enter a name for your new field:'));

  if (userInput === '') {
    return alert('You did not type anything in the field');
  } else if (userInput.length >= 26) {
    return alert('The field name which you have entered is too long.');
  } else if (userInput.length < 26) {
    // check that user hasn't entered a duplicate category
    $category.each(function(index) {
      if ($category.eq(index).text() === userInput) {
        dupl = true;
        return;
      }
    });
    if (dupl === true) {
      return alert('A category with this name already exists.');
    }

    $table = $(this).closest('table');
    tblID = $table.attr('id');
    // get the classes which need to be assigned based on the table ID
    switch (tblID) {
      case 'freeSpendTbl':
        subtotalClasses = 'freeSubtotals budgetSubtotals';
        percentClasses = 'freePercent subtotalsPercent';
        break;
      case 'fixedSpendTbl':
        subtotalClasses = 'fixedSubtotals budgetSubtotals';
        percentClasses = 'fixedPercent subtotalsPercent';
    }

    // append category table cell
    $table.find('tbody')
      .append('<tr> <td>' + userInput + '</td> </tr>');
    $newCategoryEle = $table.find('tbody td:last')
      .addClass('category');

    // append user input table cell
    $table.find('tbody tr:last')
      .append('<td>£<input/> </td>');
    $newSubtotalEle = $table.find('tbody input:last')
      .attr({
        type: 'number',
        class: subtotalClasses
      });
    // slice the tblID to get the argument for the calc function
    funcArg = tblID.slice(0, tblID.length - 3);
    $newSubtotalEle.on('input', function() {
      calculateFigures(funcArg);
    });
    if ($('#totalBudget').val() === '') {
      $newSubtotalEle.prop('disabled', true);
    }

    // append the percentage table cell
    $table.find('tbody tr:last')
      .append('<td> <input/> </td>');
    $newPercentEle = $table.find('tbody input:last')
      .attr({
        type: 'text',
        class: percentClasses
      });
    $newPercentEle.prop('readonly', true);

    // append the delete button table cell
    $table.find('tbody tr:last')
      .append('<td> <input type="button" class="btn btn-primary button deleteRow"/></td>');
    $newButtonEle = $table.find('tbody input:last')
      .val('-');
    $newButtonEle.on('click', function() {
      deleteTblRow($(this));
    });

    // check number of table rows
    if ($('#' + tblID + ' tr').length >= 22) {
      // disable add field button for that table
      $('#' + tblID + ' .addRow').prop('disabled', true)
        .removeClass('.active')
        .addClass('.disabled');
    }

  }
});
