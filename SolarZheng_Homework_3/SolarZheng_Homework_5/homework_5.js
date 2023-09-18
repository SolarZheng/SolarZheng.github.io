document.getElementById("add").onclick = function() {
				var image = document.getElementById("image");
				var name = document.getElementById("name").value;
				var time = document.getElementById("time").value;
				var director = document.getElementById("director").value;
				var actor = document.getElementById("actor").value;
				var intro = document.getElementById("intro").value;
				var length = document.getElementById("length").value;
				var type = document.getElementById("type").value;
				var score = document.getElementById("score").value;
				var tab = document.getElementsByTagName("table")[0];
				tab.innerHTML += "<tr>\n" +
					// "<td>" + "<img src='" + url + "style='width: 150px;'>" + "</td>" +
					"<td>" + "图片待审核" + "</td>" +
					"<td>" + name + "</td>\n" +
					"<td>" + time + "</td>" +
					"<td>" + director + "</td>" +
					"<td>" + actor + "</td>" +
					"<td>" + intro + "</td>" +
					"<td>" + length + "</td>" +
					"<td>" + type + "</td>" +
					"<td>" + score + "</td>" +
					"<td><input type='button' value='删除'; style='color: blue;' onclick='del(this)'> <input type='button' value='修改'' style='color: blue;'  onclick='edit(this);del(this)'></td></tr>"
				if (bool = Boolean(0)) {
					function del(obj) {
						var table = obj.parentNode.parentNode.parentNode;
						var tr = obj.parentNode.parentNode;
						table.removeChild(tr);
					}
				}
			}

			edit = function(here) {
				var table = document.getElementById("table_id");
				var index = here.parentNode.parentNode.rowIndex;

				//document.getElementById("image").value = table.rows[index].cells[0];
				document.getElementById("name").value = table.rows[index].cells[1].innerHTML;
				document.getElementById("time").value = table.rows[index].cells[2].innerHTML;
				document.getElementById("director").value = table.rows[index].cells[3].innerHTML;
				document.getElementById("actor").value = table.rows[index].cells[4].innerHTML;
				document.getElementById("intro").value = table.rows[index].cells[5].innerHTML;
				document.getElementById("length").value = table.rows[index].cells[6].innerHTML;
				document.getElementById("type").value = table.rows[index].cells[7].innerHTML;
				document.getElementById("score").value = table.rows[index].cells[8].innerHTML;
			}

			// function del(obj) {
			// 	var table = obj.parentNode.parentNode.parentNode;
			// 	var tr = obj.parentNode.parentNode;
			// 	table.removeChild(tr);
			// }
			
			function del(obj) {
				var table = obj.parentNode.parentNode.parentNode;
				var tr = obj.parentNode.parentNode;
				if (confirm("是电影信息有问题，你要改一哈？") == true) {
					table.removeChild(tr);
					alert("现在原电影信息已经传到页面上方输入栏，可以愉快修改了~");
					jfslk;//暴力终止程序
				}
			
				if (confirm("你要爪子喃？删（酸）了这个电影儿哇？我jio得有点好看嘞嘛！") == true) {
					table.removeChild(tr);
					jfslk;//暴力终止程序
				}
			
			}