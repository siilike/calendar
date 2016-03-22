(function($){

	var Schedule = {
		variables: {
			step: 30, //minutes
			step_height: 50, // Px
			start: '2016-05-16 00:00:00',
		},
		initialize: function() {
			// Render week headers
			for (var i = 0;i<7;i++) {
				var day = moment(this.variables.start).add(i,'days');
				$(".week-header .column-day:eq("+i+")").html(day.format("ddd DD"));
			}
			// Render schedule
			for (var i = 0;i<24*60/this.variables.step;i++) {
				var time = moment(this.variables.start).add(i*this.variables.step,'minutes');
				var step_element = $("<div class='step'>"+time.format("HH:mm")+"</div>");
				step_element.css({height: this.variables.step_height+"px"});
				$(".steps").append(step_element);
			}
			$(".schedule-container").css({
				height: $(".steps").height()+"px"
			});

			// Fetch data

			$.getJSON("/js/data.json",function(r){
				console.log("Process me");
				console.log(r);
			}).error(function(err){
				console.log(err);
			})
		}
	}

	Schedule.initialize();

})(jQuery);