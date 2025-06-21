using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InteractionManager : MonoBehaviour
{
    public float Threshold = 0.25f;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    RaycastHit ray;
    Transform select;
    float _t = 0;
    // Update is called once per frame
    void FixedUpdate()
    {
        Vector2 mousePos = Input.mousePosition;

        Ray _aux = Camera.main.ScreenPointToRay(Input.mousePosition);
        if (Physics.Raycast(_aux, out ray))
        {

            if (ray.transform.gameObject.tag == "Interactables")
            {
                select = ray.transform;
              //  ray.transform.SendMessage("ManipulateBee", mousePosition);
            }
        }
        else
        {
            if (select)
            {
                print(ray.transform);

                Vector3 orig = _aux.origin;
                Vector3 dir = _aux.direction;
                Vector3 ndir = dir.normalized;
                Vector3 tc = select.position - orig;

                float p = Vector3.Dot(tc, ndir);
                Vector3 t = orig + p * ndir;
                if ((select.position - t).magnitude < Threshold)
                {
                    select.gameObject.transform.position = t;
                }
            }
        }
    }
}
