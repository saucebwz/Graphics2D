Circle = new Class(Drawable, {

	initialize : function(args, context){
		this.super('initialize', arguments);

		if(isObject(args[0])){
			args = this.processObject(args[0], Circle.args);
		}

		this.attrs.cx = args[0];
		this.attrs.cy = args[1];
		this.attrs.radius = args[2];
		if(args[3]){
			this.styles.fillStyle = args[3];
		}
		if(args[4]){
			Drawable.processStroke(args[4], this.styles);
		}
	},

	attrHooks: extend(Object.assign({}, Drawable.prototype.attrHooks), {
		cx: {
			set: function(value){
				this.attrs.cx = value;
				this.update();
			}
		},
		cy: {
			set: function(value){
				this.attrs.cy = value;
				this.update();
			}
		},
		radius: {
			set: function(value){
				this.attrs.radius = Math.abs(value);
				this.update();
			}
		}
	}),

	shapeBounds : function(){
		return [this.attrs.cx - this.attrs.radius, this.attrs.cy - this.attrs.radius, this.attrs.radius * 2, this.attrs.radius * 2];
	},

	draw : function(ctx){
		if(this._visible){
			this.context.renderer.drawCircle(
				[this.attrs.cx, this.attrs.cy, this.attrs.radius],
				ctx, this.styles, this.matrix, this
			);
		}
	},

	isPointIn : function(x, y){
		return (Math.pow(x - this.attrs.cx, 2) + Math.pow(y - this.attrs.cy, 2)) <= Math.pow(this.attrs.radius, 2);
	},

	processPath: function(ctx){
		ctx.beginPath();
		ctx.arc(this.attrs.cx, this.attrs.cy, Math.abs(this.attrs.radius), 0, Math.PI * 2, true);
	}

});

Circle.args = ['cx', 'cy', 'radius', 'fill', 'stroke'];

$.circle = function(){
	return new Circle(arguments);
};

$.Circle = Circle;