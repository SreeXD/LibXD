import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { GammaCorrectionShader } from '../../utils/shaders/GammaCorrectionShader'
import { FXAAShader } from '../../utils/shaders/FXAAShader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

import SignInOrUp from '../SignInOrUp/SignInOrUp'
import SignOut from '../SignOut/SignOut'
import Help from '../Help/Help'
import StudentsList from '../StudentsList/StudentsList'
import BooksList from '../BooksList/BooksList'
import BorrowedList from '../BorrowedList/BorrowedList'
import store from '../../redux/store'
import { useAppDispatch } from '../../redux/hooks'
import { signOutUser } from '../../redux/features/userSlice'
import { months } from '../../utils/utils'
import SceneLoading from '../SceneLoading/SceneLoading'

import * as S from './SceneStyles'

const Scene = (props: any) => {
    const events: any = { }
    
    const uiActive = useRef(false)
    const [ ui, setUI ] = useState<any>(0)
    const [ auth, setAuth ] = useState<any>(props.auth)
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ loadingText, setLoadingText ] = useState<any>('')
    const dispatch = useAppDispatch()

    const cameraRef = useRef<any>()
    const sceneRef = useRef<any>()
    const controlRef = useRef<any>()
    const authRef = useRef<any>(props.auth)

    var moveCamera = () => {
        gsap.to(cameraRef.current.position, { x: 3, y: 1, z: 2, duration: 1,  
            onComplete: () => { controlRef.current.enabled = true }
        })
    }

    var resetCamera = (duration: number) => {
        controlRef.current.enabled = false
        gsap.to(cameraRef.current.position, { x: 0.08, z: 0.13, y: 0.4, duration })
    }

    const createScene = async () => {
        const canvas = document.getElementById('webgl-canvas')

        if (!canvas) {
            return 
        }

        const dims = { width: window.innerWidth, height: window.innerHeight }
        const mouse = { x: 0, y: 0 }
        
        const camera = new THREE.PerspectiveCamera(45, dims.width / dims.height) 
        cameraRef.current = camera
        
        const scene = new THREE.Scene()
        sceneRef.current = scene 

        const light = new THREE.AmbientLight(new THREE.Color(2, 2, 2), 0.5)
        scene.add(light)
    
        setLoadingText('Setting up scene')

        const loader = new GLTFLoader()
        const model = await loader.loadAsync('/resources/scene.glb')

        while (model.scene.children.length) {
            scene.add(model.scene.children[0])
        }
    
        scene.scale.set(0.35, 0.35, 0.35)
    
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
        renderer.setSize(dims.width, dims.height)
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
        renderer.outputEncoding = THREE.sRGBEncoding

        const control = new OrbitControls(camera, canvas)
        controlRef.current = control

        control.enableDamping = true 
        control.dampingFactor = 0.1
        control.maxPolarAngle = Math.PI / 2
        control.minDistance = 2
        control.maxDistance = 5
        control.enabled = false

        const composer = new EffectComposer(renderer)
    
        const renderPass = new RenderPass(scene, camera)
        composer.addPass(renderPass)
    
        const outlinePass = new OutlinePass(new THREE.Vector2(dims.width, dims.height), scene, camera)
        composer.addPass(outlinePass)

        const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
        composer.addPass(gammaCorrectionPass)

        const fxaaShaderPass = new ShaderPass(FXAAShader)

        var pixelRatio = renderer.getPixelRatio();

        let uniforms = fxaaShaderPass.material.uniforms;
        uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * pixelRatio );
        uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * pixelRatio );

        composer.addPass(fxaaShaderPass)

        window.addEventListener('resize', events.onResize = () => {
            dims.width = window.innerWidth
            dims.height = window.innerHeight
 
            composer.removePass(fxaaShaderPass)

            var uniforms = fxaaShaderPass.material.uniforms;
            uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * pixelRatio );
            uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * pixelRatio );
    
            composer.addPass(fxaaShaderPass)

            camera.aspect = dims.width / dims.height
            camera.updateProjectionMatrix()
        })

        const objects: any = {}
        objects[1] = scene.children.find(x => x.name.startsWith('Interactive1'))?.children
        objects[2] = scene.children.find(x => x.name.startsWith('Interactive2'))?.children
        objects[3] = scene.children.find(x => x.name.startsWith('Interactive3'))?.children

        window.addEventListener('mousemove', events.onMouseMove = (e: any) => {
            if (uiActive.current || !authRef.current) {
                return
            }

            mouse.x = 2 * (e.clientX - dims.width / 2.0) / dims.width
            mouse.y = -2 * (e.clientY - dims.height / 2.0) / dims.height
        
            const raycaster = new THREE.Raycaster()
            raycaster.setFromCamera(mouse, camera)
            
            const intersects = raycaster.intersectObjects(scene.children);
        
            outlinePass.selectedObjects = []
          
            for (const intersect of intersects) {
                if (intersect.object.name.startsWith('Interactive')) {
                    outlinePass.selectedObjects = objects[+(intersect.object.name.at(11) ?? 0)]
                    break
                }
            }
        })

        window.addEventListener('click', events.onClick = (e: any) => {
            if (uiActive.current || !authRef.current) {
                return
            }

            if (!outlinePass.selectedObjects.length) {
                return 
            }

            const obj: any = outlinePass.selectedObjects[0]

            if (obj) {
                outlinePass.selectedObjects = []
                uiActive.current = true
                
                setUI(+obj.name.at(11))
            }
        })

        setLoadingText('Adjusting date and time in scene')

        let now = new Date()

        const hoursHand: any = scene.children.find(obj => obj.name == 'Hours_Hand')
        const minutesHand: any = scene.children.find(obj => obj.name == 'Minutes_Hand')
        const secondsHand: any = scene.children.find(obj => obj.name == 'Seconds_Hand')

        const hoursHandStart = hoursHand.rotation.z
        const minutesHandStart = minutesHand.rotation.z
        const secondsHandStart = secondsHand.rotation.z

        const fontLoader = new FontLoader()
        const font = await fontLoader.loadAsync('/resources/threejs_font.json')

        const dateMaterial = new THREE.MeshBasicMaterial({ color: '#080808' })

        const monthGeometry = new TextGeometry(months[now.getMonth()], {
            font,
            size: 0.2,
            height: 0.01
        })

        const dayGeometry = new TextGeometry(now.getDate().toString(), {
            font,
            size: 0.47,
            height: 0.01
        })

        const monthMesh = new THREE.Mesh(monthGeometry, dateMaterial)
        const dayMesh = new THREE.Mesh(dayGeometry, dateMaterial)
        
        const monthPlaceholder: any = scene.children.find(obj => obj.name === 'Month')
        const dayPlaceholder: any = scene.children.find(obj => obj.name === 'Day')
        
        monthMesh.position.set(monthPlaceholder.position.x + 0.05, monthPlaceholder.position.y, monthPlaceholder.position.z);
        dayMesh.position.set(dayPlaceholder.position.x + 0.15, dayPlaceholder.position.y - 0.05, dayPlaceholder.position.z);

        scene.remove(monthPlaceholder)
        scene.remove(dayPlaceholder)

        scene.add(monthMesh)
        scene.add(dayMesh)

        const update = () => {
            now = new Date()
            hoursHand.rotation.z = hoursHandStart - (now.getHours() + now.getMinutes() / 60) * Math.PI / 6
            minutesHand.rotation.z = minutesHandStart - now.getMinutes() * Math.PI / 30
            secondsHand.rotation.z = secondsHandStart - now.getSeconds() * Math.PI / 30

            renderer.setSize(dims.width, dims.height)
            renderer.setClearColor('#d17c3f')
            
            control.update()
        
            composer.setSize(dims.width, dims.height)
            composer.render()

            events.onFrame = window.requestAnimationFrame(update)
        }
    
        events.onFrame = window.requestAnimationFrame(update)

        if (props.auth) {
            moveCamera()
        }

        else {
            resetCamera(0)
        }

        setLoading(false)
    }
    
    useEffect(() => {
        createScene()

        return () => {
            window.removeEventListener('resize', events.onResize)
            window.removeEventListener('mousemove', events.onMouseMove)
            window.removeEventListener('click', events.onClick)
            window.cancelAnimationFrame(events.onFrame)
        }
    }, [])

    const onSignOut = async () => {
        await dispatch(signOutUser())
        const user = store.getState().user;

        if (user.status == 'success') {
            authRef.current = false
            setAuth(false)
            resetCamera(1)
        }
    }

    const onSignIn = async () => {
        setAuth(true)
        authRef.current = true
        moveCamera()
    }

    const close = () => {
        uiActive.current = false 
        setUI(0)
    }

    return (           
        <S.CanvasContainer>    
            { loading && 
                <SceneLoading loadingText={loadingText} />
            }
            
            { !loading && auth && 
                <>
                    <Help />

                    <SignOut className={(ui > 0) ? 'go-right' : ''} onClick={onSignOut}> 
                        <img src={'/resources/signout.png'} />
                        Sign out
                    </SignOut>
                </>
            }        

            { !loading && (ui > 0 || !auth) &&
                <S.UIContainer>
                    { !auth &&
                        <SignInOrUp onSignIn={onSignIn} />
                    }

                    { ui == 1 &&
                        <BorrowedList close={close} />
                    }

                    { ui == 2 &&
                        <BooksList close={close} />   
                    }

                    { ui == 3 &&
                        <StudentsList close={close} />    
                    }
                </S.UIContainer>
            }

            <S.Canvas id='webgl-canvas' />
        </S.CanvasContainer>
    )
}

export default Scene