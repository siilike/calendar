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

			var self = this;

			$.getJSON("js/data.json", function(r) {

				var d = r.data.map(function(a)
				{
					a.start_at = moment(a.start_at);
					a.due_at = moment(a.due_at);
					a.length = -a.start_at.diff(a.due_at);
					return a;
				})
				.sort(function(a, b)
				{
					return a.start_at.diff(b.start_at) || (b.length - a.length);
				});

				var process = function(existing, col, row)
				{
					return function(acc, a)
					{
						for(var i = 0; i < acc.length; i++)
						{
							var b = acc[i][0][0];

							if(a.start_at.isSameOrAfter(b.start_at) && a.start_at.isBefore(b.due_at))
							{
								for(var k = 0; k < acc[i].length; k++)
								{
									for(var j = 0; j < acc[i][k].length; j++)
									{
										var c = acc[i][k][j];

										if(!a.start_at.isBetween(c.start_at, c.due_at) && !a.due_at.isBetween(c.start_at, c.due_at))
										{
											if(a !== c)
											{
												existing && existing(acc, a, b, c, i, k, j);
											}

											return acc;
										}
									}
								}

								col && col(acc, a, b, i);
								return acc;
							}
						}

						row && row(acc, a);
						return acc;
					}
				};

				var dd = d.reduce(process(null, null, function(acc, a)
				{
					acc.push([[ a ]]);
				}), []);

				var overflowing = [];

				var dd = d.sort(function(a, b)
				{
					return a.start_at.diff(b.start_at);
				}).reduce(process(function(acc, a, b, c, i, k, j)
				{
					if(acc[i][k].indexOf(a) == -1)
					{
						acc[i][k].push(a);
					}
				}, function(acc, a, b, i)
				{
					acc[i].push([ a ]);

					if(a.due_at.isAfter(b.due_at))
					{
						var o = {
							event: a,
							cols: [i]
						};

						overflowing.push(o);

						var col = acc[i].length-1;

						for(var ii = i+1; ii < acc.length; ii++)
						{
							var b = acc[ii][0][0];

							if(a.due_at.isSameOrAfter(b.start_at) && a.due_at.isBefore(b.due_at))
							{
								for(var k = acc[ii].length; k < col; k++)
								{
									acc[ii].push([]);
								}

								acc[ii].push([ a ]);

								o.cols.push(ii);
							}
						}
					}
				}, null), dd);

				overflowing.forEach(function(o)
				{
					var max = o.cols.reduce(function(a, b) { return Math.max(a, dd[b].length); }, 0);

					o.cols.forEach(function(c)
					{
						for(var i = dd[c].length; i < max; i++)
						{
							dd[c].push([]);
						}
					});
				});

				dd.forEach(function(g, gidx)
				{
					g.forEach(function(d, didx, dl)
					{
						d.forEach(function(a)
						{
							if(a.rendered)
							{
								return;
							}

							a.rendered = true;

							$(document.createElement("div")).addClass('event').css(
							{
								top: ((a.start_at.hour() * 60 + a.start_at.minutes()) / self.variables.step * self.variables.step_height) + 'px',
								height: ((a.length / 1000 / 60 / self.variables.step) * self.variables.step_height) + 'px',
								left: (100 / dl.length * didx) + '%',
								width: (100 / dl.length) + "%"
							})
							.text(a.start_at.format("HH:mm")+" - "+a.due_at.format("HH:mm"))
							.appendTo(".schedule-container .column-day:first");
						});
					});
				});

			}).error(function(err){
				console.log(err);
			})
		}
	}

	Schedule.initialize();

})(jQuery);