using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class BeeManipulationScript : MonoBehaviour
{
    public bool Controller = false; // True if the current GameObject is an controller. Will send commands to Bee GameObjects
    public Text Textb;
    Transform BeeTarget;
    public GameObject ARBase;
    public bool Tutorial = false;
    public bool debug;

    Touch in1, in2;
    float currDist = 0;

    public float currVelocityX = 0; // In units per second
    public float currVelocityY = 0; // In units per second
    public float currScale = 1;
    public float Tick = 0; // 1 tick = 1 ms

    public int BeeType = 0;
    public bool Clicked = false;

    public Vector3 LockVector = Vector3.one; // Default state has no lock
    public bool Scale = true;
    float maxTick = 2;


    public float _mt = 0;
    public Vector3 mousePosition;

    public AudioSource emitter;
    public float maxVol = 0.5f;
    public float minVol = 0.01f;
    RaycastHit ray;
    // Start is called before the first frame update
    void Start()
    {
     //   GameObject ARObj = GameObject.Find("ZapparARTracker");
    }

    void ManipulateBee(Vector3 pos)
    {
        print(pos);
            if (pos != Vector3.zero)
            {
                currVelocityX += -pos.x;
                currVelocityY += pos.y;
            }
            else
            {
                currVelocityX = 0;
                currVelocityY = 0;

            }


        if (!Clicked)
            _mt += Time.deltaTime;
    }



    void ZoomBee(float Scale)
    {

            gameObject.transform.localScale = new Vector3(Scale, Scale, Scale);
    }


    void ReloadBase()
    {
        if (!Tutorial)
        {
            gameObject.transform.localScale = new Vector3(0.015625f, 0.015625f, 0.015625f);
            gameObject.transform.localRotation = Quaternion.Euler(Vector3.zero);
            currVelocityX = 0;
            currVelocityY = 0;
        }
    }

    void ModifyTick(float tick)
    {
        Tick = tick;
    }

    public void Move()
    {

        if (((Input.GetMouseButton(0) && Input.touchCount == 0)) || (Input.GetMouseButton(0) && (Input.touchCount == 1)))
        {
            float modVar = 0.4f;

            if ((Input.GetMouseButton(0) && debug))
                modVar *= 10;

            mousePosition.x = modVar*Input.GetAxis("Mouse X");
            mousePosition.y = modVar*Input.GetAxis("Mouse Y");

            if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out ray))
            {

                if (ray.transform.gameObject.tag == "Bee")
                {
                  //  if (BeeTarget == null)
                     //   BeeTarget.SendMessage("ModifyTick", -1200);

                    print(mousePosition + " B " + BeeTarget + " " + LockVector);


                    mousePosition.x *= LockVector.x;
                    mousePosition.y *= LockVector.y;
                    mousePosition.z *= LockVector.z;

                    print(mousePosition + " A " + BeeTarget + " " + LockVector);

                    var beeObj = ray.transform.GetComponent<BeeManipulationScript>();

                    if (BeeTarget != ray.transform)
                    {
                        BeeTarget = ray.transform; // Update the transform
                        currScale = ray.transform.localScale.x;
                    }

                    ray.transform.SendMessage("ManipulateBee", mousePosition);
                }
            }
            else
            {

                if (BeeTarget != null)
                {
                //    BeeTarget.SendMessage("ReloadBase");
                //    BeeTarget = null;
                }
            }
        }

        /*
        else if (Input.mouseScrollDelta.y > 0)
        {
            if (currScale < 0.015625 * 3f)
                if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out ray))
                {

                    if (ray.transform.gameObject.tag == "Bee" && Scale)
                    {
                        ray.transform.SendMessage("ZoomBee", currScale += 0.005f);
                        BeeTarget = ray.transform; // Update the transform
                    }
                }
        }
        else if (Input.mouseScrollDelta.y < 0)
        {
            if (currScale > 0.015625 * 1f)
                if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out ray))
                {

                    if (ray.transform.gameObject.tag == "Bee" && Scale)
                    {
                        ray.transform.SendMessage("ZoomBee", currScale -= 0.005f);
                        BeeTarget = ray.transform; // Update the transform
                    }
                }
        }

        */

        if (Input.touchCount == 2)
        {
            in1 = Input.GetTouch(0);
            in2 = Input.GetTouch(1);

            if (in2.phase == TouchPhase.Began)
            {
                currDist = (in2.position - in1.position).magnitude;
            }

            if (in2.phase == TouchPhase.Moved)
            {
                if (currDist > (in2.position - in1.position).magnitude)
                {
                    if (currScale > 0.015625*1f)
                        if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out ray))
                        {

                            if (ray.transform.gameObject.tag == "Bee" && Scale)
                            {
                                ray.transform.SendMessage("ZoomBee", currScale -= 0.005f);
                                BeeTarget = ray.transform; // Update the transform
                            }
                        }
                }

                else if (currDist < (in2.position - in1.position).magnitude)
                {
                    if (currScale < 3*0.015625f)
                        if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out ray))
                        {

                            if (ray.transform.gameObject.tag == "Bee" && Scale)
                            {
                                ray.transform.SendMessage("ZoomBee", currScale += 0.005f);
                                BeeTarget = ray.transform; // Update the transform
                            }
                        }
                }

                currDist = (in2.position - in1.position).magnitude;
            }
        }
        else
        {
            mousePosition = Vector3.zero;
            currDist = 0;
        }
    }

    float _t1 = 0;
    float _t1m = 0.25f;

    Vector3 l1_pv;
    Vector3 l1_v;

    bool moveAnim;

    void ApplyMove()
    {
        if (moveAnim)
        {
            if (_t1 < _t1m)
            {
                transform.position = new Vector3(Mathf.Lerp(l1_pv.x, l1_v.x, _t1 / _t1m), Mathf.Lerp(l1_pv.y, l1_v.y, _t1 / _t1m), Mathf.Lerp(l1_pv.z, l1_v.z, _t1 / _t1m));
                _t1 += Time.deltaTime;
            }
            else
            {
                transform.position = l1_v;
                _t1 = 0;
                moveAnim = false;
            }
        }
    }

    public void BeeVolume(bool state)
    {
    }

    public void MoveTo(Vector3 dest)
    {
        l1_pv = transform.position;
        l1_v = dest;
        moveAnim = true;
    }

    void OnTick()
    {
        if (Tick > maxTick)
        {
            Tick = 0;
            //if (currVelocityX > 10)
            //    currVelocityX -= 0.05f;
            //else if (currVelocityX > 5)
            //    currVelocityX -= 0.005f;
            //else if (currVelocityX > 2.5)
            //    currVelocityX -= 0.0005f;
            //else if (currVelocityX > 0)
            //    currVelocityX -= 0.00005f;
            //else if (currVelocityX < 0)
            //    currVelocityX = 0;

            //if (currVelocityY > 10)
            //    currVelocityY -= 0.05f;
            //else if (currVelocityY > 5)
            //    currVelocityY -= 0.005f;
            //else if (currVelocityY > 2.5)
            //    currVelocityY -= 0.0005f;
            //else if (currVelocityY > 1)
            //    currVelocityY -= 0.00005f;
            //else if (currVelocityY < 0)
            //    currVelocityY = 0;

            if (currVelocityX > 0)
                currVelocityX -= 0.0000005f;
            else if (currVelocityX < 0)
                currVelocityX += 0.0000005f;

            if (currVelocityY > 0)
                currVelocityY -= 0.0000005f;
            else if (currVelocityY < 0)
                currVelocityY += 0.0000005f;

            transform.Rotate(0, currVelocityX, currVelocityY, Space.World);
        }
        else
        {
            if (Tick < 0)
            {
                currVelocityX = 0;
                currVelocityY = 0;
            }
            Tick += Time.deltaTime * 1000;
        }
    }

    IEnumerator DelayedControl()
    {
        while (true)
        {
            OnTick();

            yield return null;
        }
       
    }
    // Update is called once per frame
    void OnEnable()
    {
        if (!Controller)
        {
          //  StartCoroutine(DelayedControl());
            
        }
        else
        {
            Move();
        }
    }

    void FixedUpdate()
    {
        if (!Controller)
        {
            OnTick();
            ApplyMove();
        }
        else
        {
            Move();
        }
    }

    void OnDestroy()
    {
     //   StopCoroutine(DelayedControl());
    }
}
