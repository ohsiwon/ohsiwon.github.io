function canvasBackground()
{
    'use strict';
    var camera,
    scene,
    renderer,
    particles       = [],
    max_z_depth     = 600,
    total_particle  = 60,
    velocity        = 1,
    theta           = 0,
    w_margin        = 100,
    w_width         = window.innerWidth + w_margin,
    w_height        = window.innerHeight + w_margin,
    mode_surf       = true,
    mode_coaster    = false,
    rm,p;

    function init()
    {
        camera = new THREE.PerspectiveCamera(45, w_width / w_height, 1, max_z_depth * 2);
        camera.position.z = max_z_depth / 2;
        scene = new THREE.Scene();
        scene.add(camera);

        renderer = new THREE.CanvasRenderer();
        renderer.setSize(w_width, w_height);
        document.getElementById('backgroundCanvas').appendChild(renderer.domElement);

        createParticles();
        THREEx.WindowResize(renderer, camera, w_margin);
        render();
    };

    function render()
    {
        updateParticles();
        theta += 1;

        if (mode_surf)
        {
            camera.position.x = 50 * Math.cos(theta * Math.PI / 360);
            camera.position.y = 50 * Math.cos(theta * Math.PI / 360);
        }

        if (mode_coaster)
        {
            camera.position.z = 100 * Math.sin(theta * Math.PI / 360);
        }

        camera.lookAt(scene.position);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    function createParticles()
    {
        var particle,
        material,
        rm = max_z_depth / 2;

        for (var i = 0; i < total_particle; i++)
        {

            material = new THREE.ParticleCanvasMaterial(
            {
                color: 0xFFFFFF,
                opacity: 0,
                program: particleRender
            });

            particle = new THREE.Particle(material);
            randomXYPosition(particle);
            particle.position.z = -max_z_depth / 2 + (max_z_depth / total_particle * i);
            scene.add(particle);
            particles.push(particle);
        }
    };

    function particleRender(context)
    {
        context.beginPath();
        context.arc(0, 0, 5, 0, Math.PI * 2, true);
        context.fill();
    };

    function updateParticles()
    {
        var nm; //new meterial
        for (var i = 0; i < particles.length; i++)
        {
            p = particles[i];
            p.position.z += velocity;


            nm = p.material;

            if (p.position.z >= max_z_depth / 2)
            {
                p.position.z = -max_z_depth / 2;
                nm.opacity = 0;
                p.material = nm;
            }
            else if (p.position.z >= max_z_depth / 2 - 50)
            {
                nm.opacity -= .02;
                if (nm.opacity < 0) nm.opacity = 0;
                p.material = nm;
            }
            else
            {
                if (nm.opacity < 1)
                {
                    nm.opacity += .01;
                    if (nm.opacity > 1) nm.opacity = 1;
                    p.material = nm;
                }
            }
        }
    };

    function randomXYPosition(p)
    {
        rm = max_z_depth / 2;
        p.position.x = Math.random() * rm - rm / 2;
        p.position.y = Math.random() * rm - rm / 2;
    };

    canvasBackground.prototype.start = function()
    {
        init();
    };

    canvasBackground.prototype.piloting = function(mode, instant)
    {
        if (instant)
        {
            setMode();
            return;
        }

        $('#backgroundCanvas').animate(
        {
            opacity: 0
        }, 500, function()
        {
            setMode();
            $(this).animate(
            {
                opacity: 1
            }, 500);
        });

        function setMode()
        {
            camera.position.x = 0;
            camera.position.y = 0;
            camera.position.z = max_z_depth / 2;
            switch (mode)
            {
            case 1:
                mode_surf = false;
                mode_coaster = false;
                break;
            case 2:
                mode_surf = true;
                mode_coaster = false;
                break;
            case 3:
                mode_surf = true;
                mode_coaster = true;
                break;
            }
        };
    };

    canvasBackground.prototype.throttle = function(n)
    {
        velocity = parseFloat(n);
    };
};

if(!window.requestAnimationFrame){window.requestAnimationFrame=(function(){return window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(callback,element){return window.setTimeout(callback,1000/60);};})();};if(!window.cancelRequestAnimationFrame){window.cancelRequestAnimationFrame=(function(){return window.webkitCancelRequestAnimationFrame||window.mozCancelRequestAnimationFrame||window.oCancelRequestAnimationFrame||window.msCancelRequestAnimationFrame||clearTimeout})();};