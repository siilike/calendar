(function($){

	var Dentalink = {
		variables: {
			step: 30, //minutes
			step_height: 50, // Px
			start: '2016-05-15 00:00:00'
		},
		initialize: function() {
			for (var i = 0;i<24*60/this.variables.step;i++) {
				var time = moment(this.variables.start).add(i*this.variables.step,'minutes');
				var step_element = $("<div class='step'>"+time.format("HH:mm")+"</div>");
				step_element.css({height: this.variables.step_height+"px"});
				$(".steps").append(step_element);
			}
			$(".schedule-container").css({
				height: $(".steps").height()+"px"
			})

		}
	}

	Dentalink.initialize();

})(jQuery);