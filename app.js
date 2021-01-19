angular
  .module("webapp", ["ngMaterial", 'ngAnimate', 'ui.bootstrap'])
  .controller("AppCtrl", function ($scope, $filter, $http, $sce, $window) {
    $scope.para = $sce.trustAsHtml("<p>Last week we installed a kitty door so that our cat could come and go as she pleases. Unfortunately, we ran into a problem. Our cat was afraid to use the kitty door. We tried pushing her through, and that caused her to be even more afraid. The kitty door was dark, and she could not see what was on the other side. The first step we took in solving this problem was taping the kitty door open.</p> <p>After a couple of days, she was confidently coming and going through the open door. However, when we removed the tape and closed the door, once again, she would not go through. They say you catch more bees with honey, so we decided to use food as bait. We would sit next to the kitty door with a can of wet food and click the top of the can. When kitty came through the closed door, we would open the can and feed her. It took five days of doing this to make her unafraid of using the kitty door. Now we have just one last problem: our kitty controls our lives!</p>")
    $scope.customText = 'AaBb';
    $scope.orderList = ['Featured', 'Name'];
    $scope.order = $scope.orderList[0];
    $scope.fontSize = 50;
    $scope.fontStyle = {
      "font-family": "",
      'font-size': '20px'
    };
    $scope.bigCurrentPage = 1;
    $scope.numPerPage = 10;
    $scope.classtnList = [];
    $scope.selectedClass = '';
    $scope.searchText = '';
    $scope.expandCls = false;
    $scope.expandFontPicker = false;
    $scope.loading = true;
    $scope.selectedFont = '';

    $http({
      method: 'GET',
      url: 'https://typekit.com/api/v1/json/kits/vwf6pwe/published',
      accept: 'application/json',

    }).then(function success(response) {
      $scope.fonts = response.data;
      $scope.displayNextFonts($scope.fonts.kit.families);
      for (var key in $scope.fonts.kit.families) {
        const val = $scope.fonts.kit.families[key].css_stack.split(',')[1]
        if (!$scope.classtnList.includes(val)) {
          $scope.classtnList.push(val)
        }
      }
    }, function error(err) {
      console.log(err)
    });

    $scope.change = function (option) {
      $scope.fontStyle["font-family"] = option;
    };

    $scope.redirectTo = function () {
      $window.open('https://edgewebfonts.adobe.com/fonts', '_blank');
    }

    $scope.reset = function () {
      $scope.customText = ' ';
      console.log($scope.customText)
    }

    $scope.pageChanged = function (val, searchText) {
      $scope.bigCurrentPage = val;
      if (searchText || $scope.selectedClass) {
        $scope.displayNextFonts($scope.filteredFonts)
      } else {
        $scope.displayNextFonts($scope.fonts.kit.families);
      }
    };

    $scope.filterByClass = function (value, searchText) {
      $scope.loading = true;
      $scope.selectedClass = value;
      $scope.searchText = searchText;
      $scope.filteredFonts = $scope.fonts.kit.families;
      if (value) {
        $scope.filteredFonts = $scope.fonts.kit.families.filter((font) => font.css_stack.split(',')[1] === value);
      }
      $scope.fetchdata($scope.searchText);
    }

    $scope.fetchdata = function (val) {
      $scope.filteredFonts = $filter('filter')($scope.filteredFonts, { name: val });
      $scope.sortBy($scope.order);
    }

    $scope.sortBy = function (value) {
      $scope.order = value;
      if ($scope.selectedClass || $scope.searchText) {
        if (value === 'Name') {
          $scope.filteredFonts = $filter('orderBy')($scope.filteredFonts, 'name', false);
        } else if (value === 'Featured') {
          $scope.filteredFonts = $filter('orderBy')($scope.filteredFonts, 'id', false)
        }
        $scope.displayNextFonts($scope.filteredFonts);
      } else {
        if (value === 'Name') {
          $scope.fonts.kit.families = $filter('orderBy')($scope.fonts.kit.families, 'name', false);
        } else if (value === 'Featured') {
          $scope.fonts.kit.families = $filter('orderBy')($scope.fonts.kit.families, 'id', false)
        }
        $scope.displayNextFonts($scope.fonts.kit.families);
      }
    }

    $scope.displayNextFonts = function (array) {
      var begin = (($scope.bigCurrentPage - 1) * $scope.numPerPage)
        , end = begin + $scope.numPerPage;
      $scope.fontsPerPage = array.slice(begin, end);
      $scope.loading = false;
    }

  });
